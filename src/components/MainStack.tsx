import { Link } from "@remix-run/react";
import { useState } from "react";

export const MainStack: () => React.JSX.Element = () => {
  const [count, setCount] = useState(0);
  const link = (input: "/facts" | "/pictures") => input;
  return (
    <div id="main-stack">
      <nav>
        <Link to={link("/facts")}>Facts</Link><br />
        <Link to={link("/pictures")}>Collage</Link>
      </nav>
      <main>
        <p><b>Use the links above</b> to go to the different pages of our report.</p>
        <p>The menu is a Word document on <Link to="https://office.com">Microsoft 365.</Link></p>
      </main>
    </div>
  );
};