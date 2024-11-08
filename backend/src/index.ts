import { app } from "./app";
import { setupRoutes } from "./routes";

setupRoutes(app);

const port = 3000;
app.listen(port, () => console.log(`Example app is listening on port ${port}.`));
