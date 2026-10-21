// ==========================================
// Custom Hook: useUndoableDelete
// Entity-agnostic optimistic delete manager with live countdown toasts & synchronous undo
// ==========================================

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import Notify, { NotifyUndo } from "../Utils/notify";

/**
 * Universal hook providing undoable delete workflow with live countdown toasts.
 *
 * @param {Object} config
 * @param {string} [config.entity="item"] - Entity namespace for keys and toast IDs (e.g. 'article', 'event')
 * @param {string} [config.entityLabel="مورد"] - Human-readable entity label in Persian (e.g. 'مقاله', 'رویداد')
 * @param {Array} [config.items=[]] - Current items list from component state
 * @param {Function} [config.getId] - Getter returning item unique ID: (item) => string
 * @param {Function} [config.getLabel] - Getter returning item title/name for toast: (item) => string
 * @param {Function} config.deleteFn - Async delete service function: (id) => Promise
 * @param {Function} [config.onDeleted] - Callback on backend delete success: (id, item) => void
 * @param {Function} [config.onError] - Callback on backend delete failure: (id, error, item) => void
 * @param {number} [config.duration=5000] - Duration in ms for undo countdown window
 * @returns {Object} { visibleItems, requestDelete, undoDelete, commitDelete, isPending, pendingCount }
 */
export function useUndoableDelete({
  entity = "item",
  entityLabel = "مورد",
  items = [],
  getId = (item) => item?._id || item?.id,
  getLabel,
  getItemTitle, // backward-compat alias
  deleteFn,
  onDeleteApi, // backward-compat alias
  onDeleted,
  onSuccess, // backward-compat alias
  onError,
  duration = 5000,
  undoDuration, // backward-compat alias
}) {
  const actualDuration = duration || undoDuration || 5000;
  const actualDeleteFn = deleteFn || onDeleteApi;
  const actualOnDeleted = onDeleted || onSuccess;
  const actualGetLabel =
    getLabel ||
    getItemTitle ||
    ((item) => item?.title || item?.name || item?.fullName || item?.author || "");

  // Map of safeId -> { id: safeId, rawId, item, expiresAt, toastId }
  const [pendingDeletes, setPendingDeletes] = useState({});

  // Synchronous refs to avoid stale closure races and redundant renders
  const timersRef = useRef(new Map());
  const statusRef = useRef(new Map()); // safeId -> 'pending' | 'committing'
  const pendingDeletesRef = useRef({});
  const itemsRef = useRef(items);
  itemsRef.current = items;

  // Stable references for async callbacks and selectors
  const deleteFnRef = useRef(actualDeleteFn);
  deleteFnRef.current = actualDeleteFn;

  const onDeletedRef = useRef(actualOnDeleted);
  onDeletedRef.current = actualOnDeleted;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const getIdRef = useRef(getId);
  getIdRef.current = getId;

  const getLabelRef = useRef(actualGetLabel);
  getLabelRef.current = actualGetLabel;

  // Sync ref with state
  useEffect(() => {
    pendingDeletesRef.current = pendingDeletes;
  }, [pendingDeletes]);

  // Derived visible items list without mutating original array
  const visibleItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter((item) => {
      const currentId = getIdRef.current ? getIdRef.current(item) : (item?._id || item?.id);
      if (!currentId) return true;
      const safeId = String(currentId);
      return !pendingDeletes[safeId];
    });
  }, [items, pendingDeletes]);

  /**
   * Undoes a pending deletion synchronously without making any backend request.
   */
  const undoDelete = useCallback(
    (targetId) => {
      let resolvedId = targetId;
      if (!resolvedId) {
        const keys = Object.keys(pendingDeletesRef.current);
        if (keys.length > 0) {
          resolvedId = keys[keys.length - 1];
        }
      }
      if (!resolvedId) return;
      const safeId = String(resolvedId);

      const status = statusRef.current.get(safeId);
      // Guard against race condition if request is already committing / in-flight
      if (status === "committing") return;

      // Clear timeout and remove status
      const timer = timersRef.current.get(safeId);
      if (timer) {
        clearTimeout(timer);
        timersRef.current.delete(safeId);
      }
      statusRef.current.delete(safeId);

      // Instant removal of toast
      const toastId = `undo:${entity}:${safeId}`;
      toast.remove(toastId);
      Notify.remove(toastId);

      // Remove from pendingDeletes so item reappears in original place in same render batch
      delete pendingDeletesRef.current[safeId];
      setPendingDeletes((prev) => {
        const next = { ...prev };
        delete next[safeId];
        delete next[resolvedId];
        return next;
      });
      // No backend request is sent
    },
    [entity]
  );

  /**
   * Commits the real deletion to the backend after the undo countdown expires.
   */
  const commitDelete = useCallback(
    async (targetId) => {
      if (!targetId) return;
      const safeId = String(targetId);

      const status = statusRef.current.get(safeId);
      if (status === "committing") return;

      // Transition to committing synchronously to guard against concurrent undo clicks
      statusRef.current.set(safeId, "committing");

      // Remove timer handle
      const timer = timersRef.current.get(safeId);
      if (timer) {
        clearTimeout(timer);
        timersRef.current.delete(safeId);
      }

      // Remove active countdown toast immediately
      const toastId = `undo:${entity}:${safeId}`;
      toast.remove(toastId);
      Notify.remove(toastId);

      const entry = pendingDeletesRef.current[safeId];
      const item = entry?.item;
      const rawId = entry?.rawId || safeId;

      try {
        const fn = deleteFnRef.current;
        if (typeof fn !== "function") {
          throw new Error(`deleteFn is not defined for entity: ${entity}`);
        }

        const response = await fn(rawId);
        if (response && response.success === false) {
          throw new Error(response.message || `حذف ${entityLabel} ناموفق بود`);
        }

        // Succeeded: remove permanently from original state / refetch
        onDeletedRef.current?.(rawId, item);

        // Clean up records
        delete pendingDeletesRef.current[safeId];
        statusRef.current.delete(safeId);
        setPendingDeletes((prev) => {
          const next = { ...prev };
          delete next[safeId];
          delete next[rawId];
          return next;
        });

        Notify.success(`${entityLabel} با موفقیت حذف شد`);
      } catch (error) {
        // Failed: restore item by clearing pending without calling onDeleted
        delete pendingDeletesRef.current[safeId];
        statusRef.current.delete(safeId);
        setPendingDeletes((prev) => {
          const next = { ...prev };
          delete next[safeId];
          delete next[rawId];
          return next;
        });

        onErrorRef.current?.(rawId, error, item);
        const errMsg =
          error?.response?.data?.message ||
          error?.message ||
          `حذف ${entityLabel} ناموفق بود`;
        Notify.error(errMsg);
      }
    },
    [entity, entityLabel]
  );

  /**
   * Initiates the undoable delete flow for an item or item ID.
   */
  const requestDelete = useCallback(
    (itemOrId) => {
      if (!itemOrId) return;

      let item;
      let rawId;
      if (typeof itemOrId === "object" && itemOrId !== null) {
        item = itemOrId;
        rawId = getIdRef.current ? getIdRef.current(item) : (item._id || item.id);
      } else {
        rawId = itemOrId;
        item =
          itemsRef.current?.find((i) => {
            const currentId = getIdRef.current ? getIdRef.current(i) : (i._id || i.id);
            return String(currentId) === String(rawId);
          }) || {
            _id: rawId,
            id: rawId,
          };
      }

      if (!rawId) return;
      const safeId = String(rawId);

      // Prevent duplicate double-clicks
      if (statusRef.current.get(safeId) === "pending" || statusRef.current.get(safeId) === "committing") {
        return;
      }

      // Compute expiresAt epoch timestamp ONCE
      const expiresAt = Date.now() + actualDuration;
      statusRef.current.set(safeId, "pending");

      const label = getLabelRef.current ? getLabelRef.current(item) : "";
      const toastId = `undo:${entity}:${safeId}`;

      const message = label
        ? `${entityLabel} «${label}» حذف شد`
        : `${entityLabel} حذف شد`;

      NotifyUndo({
        id: toastId,
        message,
        entityLabel,
        expiresAt,
        onUndo: () => undoDelete(safeId),
      });

      const entry = { id: safeId, rawId, item, expiresAt, toastId };
      pendingDeletesRef.current[safeId] = entry;
      setPendingDeletes((prev) => ({ ...prev, [safeId]: entry }));

      // Start independent countdown timer
      const timeoutId = setTimeout(() => {
        commitDelete(safeId);
      }, actualDuration);

      timersRef.current.set(safeId, timeoutId);
    },
    [actualDuration, entity, entityLabel, undoDelete, commitDelete]
  );

  // Cleanup & Flush on unmount (e.g. route navigation)
  useEffect(() => {
    const timersMap = timersRef.current;
    const statusMap = statusRef.current;
    const pendingMap = pendingDeletesRef.current;

    return () => {
      const activeIds = Array.from(timersMap.keys());
      activeIds.forEach((safeId) => {
        const timer = timersMap.get(safeId);
        if (timer) {
          clearTimeout(timer);
          timersMap.delete(safeId);
        }

        const status = statusMap.get(safeId);
        if (status === "pending") {
          statusMap.set(safeId, "committing");

          const toastId = `undo:${entity}:${safeId}`;
          toast.remove(toastId);
          Notify.remove(toastId);

          const entry = pendingMap[safeId];
          const item = entry?.item;
          const rawId = entry?.rawId || safeId;

          // Best-effort immediate flush to preserve user intent on navigation
          const fn = deleteFnRef.current;
          if (typeof fn === "function") {
            fn(rawId)
              .then((res) => {
                if (!res || res.success !== false) {
                  onDeletedRef.current?.(rawId, item);
                }
              })
              .catch((err) => {
                console.error(`Unmount flush delete failed for ${entity}:`, err);
              });
          }
        }
      });
    };
  }, [entity]);

  const isPending = useCallback(
    (itemOrId) => {
      const rawId =
        typeof itemOrId === "object" && itemOrId !== null
          ? (getIdRef.current ? getIdRef.current(itemOrId) : (itemOrId._id || itemOrId.id))
          : itemOrId;
      if (!rawId) return false;
      return Boolean(pendingDeletes[String(rawId)]);
    },
    [pendingDeletes]
  );

  return {
    visibleItems,
    requestDelete,
    undoDelete,
    commitDelete,
    isPending,
    pendingCount: Object.keys(pendingDeletes).length,
    pendingDeletes,
  };
}

export default useUndoableDelete;
