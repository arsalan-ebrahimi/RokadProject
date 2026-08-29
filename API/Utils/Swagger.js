import swaggerJSDoc from "swagger-jsdoc";

const descriptionMd = `
API documentation for the Application

### 📚 Global Query Parameters Guide
In all GET All endpoints, you can use the following parameters to filter, paginate, and search:

#### 🔍 Global Search (\`q\`)
Global search across all text fields.
- Example: \`?q=test\` (searches for "test" in title, description, etc.)

#### 📄 Pagination (\`page\` & \`limit\`)
Result pagination.
- \`page\`: Page number (default: 1)
- \`limit\`: Number of items per page (default: 10)
- Example: \`?page=2&limit=20\`

#### ↕️ Sorting (\`sort\`)
Sort results by one or more fields. Use \`-\` for descending order.
- Example: \`?sort=-createdAt,title\` (newest first, then alphabetical by title)

#### 🎯 Field Limiting (\`fields\`)
Retrieve only specific fields (to reduce response payload size).
- Example: \`?fields=title,description,createdAt\`

#### 🔗 Entity Population (\`populate\`)
Get the full data of relational fields (Database Join).
- Example: \`?populate=author,comments\`

#### ⚙️ Dynamic Filters (Advanced Filtering)
You can directly apply conditions to any field:
- **Equality**: \`?role=admin\`
- **Greater/Less than (\`gte\`, \`lte\`, \`gt\`, \`lt\`)**: \`?price[gte]=1000&price[lte]=5000\`
- **In/Not in (\`in\`, \`nin\`)**: \`?category[in]=tech,news\`
- **Regex**: \`?title[regex]=^Tutorial\` (Titles starting with "Tutorial")
`;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rokad API",
      version: "1.0.0",
      description: descriptionMd
    },
    servers: [
      {
        url: "http://localhost:5000",
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./Modules/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
