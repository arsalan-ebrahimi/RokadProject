import { useState } from "react"

const useFilds = (intialValue = {})=>{
    const [fields,useFields]  = useState(intialValue)
    const handleChange = (e)=>useFields({...fields, [e.target.name] : e.target.value})
    return [fields,handleChange]
}

export default useFilds