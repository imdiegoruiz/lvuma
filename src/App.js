import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import headersAuth from './auth/headers.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit, faUserMinus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useStyles } from './css-custom/Styles'
import PaginationUsers from './util/PaginationUsers';
import { FormControlLabel,ListItem, Checkbox,Container, Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField, AppBar, Toolbar} from '@material-ui/core';
import userAPI from './util/api-url';

function App() {

  const styles = useStyles();

  // store the data from the API REST
  const [data, setData] = useState([]);

  //Constant to divide the rows
  const TOTAL_PER_PAGE = 5;
  // Store the sate of the currentPage
  const [currentPage, setCurrentPage] = useState(1);

  // Manage the modal Add, Edit, Delete
  const [modalAddUser, setModalAddUser] = useState(false);
  const [modalEditUser, setModalEditUser] = useState(false);
  const [modalDeleteUser, setModalDeleteUser] = useState(false);

  const [checked, setChecked] = useState(false);

  // to get data new user in fields
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    gender: '',
    status: 'inactive'
  })

  //  onChange in every typing keyboard in inputs by name
  const handleChange = e => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: value
    }))
    console.log(newUser);
  }
  // to active or inactive
  const handleChangeActiveUser = e => {
    setChecked(e.target.checked);
    (e.target.checked === true) ? setNewUser(prevState => ({
      ...prevState,
      'status': 'active'
    })) : setNewUser(prevState => ({
      ...prevState,
      'status': 'inactive'
    }))
  };

  //Methods to REST-API
  const getUsers = async () => {
    await axios.get(userAPI).then(response => {
      setData(response.data.data);
    }).catch(error => {
      console.log(error);
    })
  }

  const saveUser = async () => {
    await axios.post(userAPI, newUser, headersAuth).then(response => {
      setData(data.concat(response.data.data));
      openAndCloseModal();
    }).catch(error => {
      console.log(error);
    })
  }

  const editUser = async () => {
    await axios.put(userAPI + newUser.id, newUser, headersAuth)
      .then(response => {
        var newData = data;
        newData.map(user => {
          if (newUser.id === user.id) {
            user.name = newUser.name;
            user.email = newUser.email;
            user.status = newUser.status;
            user.gender = newUser.gender;
          }
        })
        setData(newData);
        openAndCloseModalEdit();
      }).catch(error => {
        console.log(error);
      })
  }

  const deleteUser = async () => {
    await axios.delete(userAPI + newUser.id, headersAuth)
      .then(response => {
        setData(data.filter(user => user.id !== newUser.id));
        openAndCloseModalDelete();
      }).catch(error => {
        console.log(error);
      })
  }

  const openAndCloseModal = () => {
    setModalAddUser(!modalAddUser)
  }

  const openAndCloseModalEdit = () => {
    setModalEditUser(!modalEditUser)
  }

  const openAndCloseModalDelete = () => {
    setModalDeleteUser(!modalDeleteUser)
  }

  //To icons in the tables edit and delete
  const selectUser = (currentUser, flag) => {
    setNewUser(currentUser);
    (flag === 'Edit') ? openAndCloseModalEdit() : openAndCloseModalDelete()
  }

  //manage the pagination
  const getTotalPages = () => {
    let totalUsers = data.length;
    return Math.ceil(totalUsers / TOTAL_PER_PAGE);
  }

  let usersPerPage = data.slice((currentPage - 1) * TOTAL_PER_PAGE, currentPage * TOTAL_PER_PAGE);

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const bodyModalAddUser = (
    <div className={styles.modal}>
      <h3>Add new User</h3>
      <TextField name="name" className={styles.inputMaterial} label="name" onChange={handleChange}></TextField><br />
      <TextField name="email" className={styles.inputMaterial} label="email" onChange={handleChange}></TextField><br />
      <TextField name="gender" className={styles.inputMaterial} label="gender" onChange={handleChange}></TextField><br />
      <ListItem alignItems="center" className={styles.inputMaterial}> 
      <FormControlLabel control={<Checkbox checked={checked} onChange={handleChangeActiveUser} name="status" />} label="active or inactive? " />
      </ListItem>
<br />
      <br />
      <div align="right">
        <Button color='primary' onClick={() => saveUser()}>Save</Button>
        <Button color='primary' onClick={() => openAndCloseModal()}>Cancel</Button>
      </div>
    </div>
  )

  const bodyModalEditUser = (
    <div className={styles.modal}>
      <h3>Editing User</h3>
      <TextField name="name" className={styles.inputMaterial} label="name" onChange={handleChange} value={newUser && newUser.name}></TextField><br />
      <TextField name="email" className={styles.inputMaterial} label="email" onChange={handleChange} value={newUser && newUser.email}></TextField><br />
      <TextField name="gender" className={styles.inputMaterial} label="gender" onChange={handleChange} value={newUser && newUser.gender}></TextField><br />
      <TextField name="status" className={styles.inputMaterial} label="status" onChange={handleChange} value={newUser && newUser.status}></TextField><br />
      <br />
      <div align="right">
        <Button color='primary' onClick={() => editUser()}>Save</Button>
        <Button color='primary' onClick={() => openAndCloseModalEdit()}>Cancel</Button>
      </div>
    </div>
  )

  const bodyModalDeleteUser = (
    <div className={styles.modal}>
      <h3>Delete User</h3>
      <p>Do you want delete user {newUser.name}?</p>
      <br />
      <div align="right">
        <Button color='secondary' onClick={() => deleteUser()}>Yes</Button>
        <Button color='primary' onClick={() => openAndCloseModalDelete()}>Cancel</Button>
      </div>
    </div>
  )

  //get data in the home with first load
  useEffect(() => {
    getUsers();
  }, [])


  return (
    <Container>
      <AppBar position='static'>
        <Toolbar>
          <img src="images/lvx.jpg" alt="" />
          <Button onClick={() => openAndCloseModal()}><FontAwesomeIcon icon={faUserPlus} /></Button>
        </Toolbar>
      </AppBar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {usersPerPage.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <Button color='primary' onClick={() => selectUser(user, 'Edit')}><FontAwesomeIcon icon={faUserEdit} /></Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button color='primary' onClick={() => selectUser(user, 'Delete')}><FontAwesomeIcon icon={faUserMinus} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      </TableContainer>

      <Modal open={modalAddUser} onClose={openAndCloseModal}>
        {bodyModalAddUser}
      </Modal>

      <Modal open={modalEditUser} onClose={openAndCloseModalEdit}>
        {bodyModalEditUser}
      </Modal>

      <Modal open={modalDeleteUser} onClose={openAndCloseModalDelete}>
        {bodyModalDeleteUser}
      </Modal>

      <PaginationUsers page={currentPage} total={getTotalPages()} 
      onChange={(page) => {
        setCurrentPage(page);
      }}></PaginationUsers>

    </Container>

  );
}

export default App;
