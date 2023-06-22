import { useState, useEffect } from 'react';
/* import styles  from '../../styles/Users.module.css' */
import CardViewUsers from 'components/CardViewUsers';
/* import {  findAssetsPagination, getAllCollection } from "lib/models/assets"; */
function UserList() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    }

    fetchUsers();
  }, []);

  return (
    <div style={{padding:'50px'}}>
      <h1>Administración de usuarios Klean-Vet</h1>
      <div style={{width:'80%'}}>
      {/* {users.map((users) => (
           <CardViewUsers
           />
          ))} */}
      </div>
    </div>
  );
}

export default UserList;