import { RouterProvider } from "react-router-dom";
import { appRouter } from "../routes/appRouter";

export default function App() {
  return <RouterProvider router={appRouter} />;
}
