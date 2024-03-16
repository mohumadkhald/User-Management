import Nav from "./components/Nav";
import AddUser from "./components/AddUser";

export default function Home() {
  return (
    <>
      <Nav></Nav>
      <main>
        <AddUser></AddUser>
      </main>
    </>
  );
}
