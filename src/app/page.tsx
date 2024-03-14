import Nav from "./components/Nav";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

export default function Home() {
  return (
    <>
      <Nav></Nav>
      <main>
        <AddUser></AddUser>
        <UserList></UserList>
      </main>
    </>
  );
}
