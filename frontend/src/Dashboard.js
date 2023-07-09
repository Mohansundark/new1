import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import { withRouter } from './utils';

import './Dashboard.css';
import NavbarLogout from './components/NavbarLogout';
import Footer from './components/Footer';
// import Navbar from './components/Navbar';
const axios = require('axios');


class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openTicketModal: false,
      openTicketEditModal: false,
      id: '',
      category:'',
      subCategory:'',
      description:'',
      page: 1,
      search: '',
      tickets: [],
      pages: 0,
      loading: false
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.navigate("/userLogin");
    } else {
      this.setState({ token: token }, () => {
        this.getTicket();
      });
    }
  }

  getTicket = () => {
    
    this.setState({ loading: true });

    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios.get(`http://localhost:2000/get${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, tickets: res.data.tickets, pages: res.data.pages });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, tickets: [], pages: 0 },()=>{});
    });
  }

  deleteTicket = (id) => {
    axios.post('http://localhost:2000/delete', {
      id: id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.setState({ page: 1 }, () => {
        this.pageChange(null, 1);
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getTicket();
    });
  }

  logOut = () => {
    localStorage.setItem('token', null);
    this.props.navigate("/");
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => { });
    if (e.target.name === 'search') {
      this.setState({ page: 1 }, () => {
        this.getTicket();
      });
    }
  };

  createTicket = () => {
    // const file = new FormData();
    // file.append('category',this.state.category);
    // file.append('subCategory',this.state.subCategory);
    // file.append('description',this.state.description);
    
    const data = {
      category:this.state.category,
      subCategory:this.state.subCategory,
      description:this.state.description,
    };

    axios.post('http://localhost:2000/create', data, {
      headers: {
        // 'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleTicketClose();
      this.setState({ category:'',subCategory:'', description:'', file:null, page: 1 }, () => {
        this.getTicket();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleTicketClose();
    });

  }

  updateTicket = () => {
    // const file = new FormData();
    // file.append('id',this.state.id);
    // file.append('category',this.state.category);
    // file.append('subCategory',this.state.subCategory);
    // file.append('description',this.state.description);
    
    const data = {
      id:this.state.id,
      category:this.state.category,
      subCategory:this.state.subCategory,
      description:this.state.description,
    }

    axios.post('http://localhost:2000/update', data, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleTicketEditClose();
      this.setState({ category:'',subCategory:'',description:''  }, () => {
        this.getTicket();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleTicketEditClose();
    });

  }

  handleTicketOpen = () => {
    this.setState({
      openTicketModal: true,
      id: '',
      category:'',
      subCategory:'',
      description:'',
    });
  };

  handleTicketClose = () => {
    this.setState({ openTicketModal: false });
  };

  handleTicketEditOpen = (data) => {
    this.setState({
      openTicketEditModal: true,
      id: data._id,
      category:data.category,
      subCategory:data.subCategory,
      description:data.description,
    
    });
  };

  handleTicketEditClose = () => {
    this.setState({ openTicketEditModal: false });
  };

  render() {
    return (
      <div>

        {this.state.loading && <LinearProgress size={40} />}
        <NavbarLogout logOut={this.logOut}/>
       
        <div>
          <div className='logout-btn'>
          
          </div>
          <form className='form-group'>
            <table>
              <tbody>
                <tr>
                  <td>
                    <label>Create Ticket :</label>
                  </td>
                  <td>
                  <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleTicketOpen}
          >
            Create Ticket
          </Button>
                  </td>
                </tr>
               
              </tbody>
            </table>
          </form>
          
          
        </div>

        {/* Edit Product */}
        <Dialog
          open={this.state.openTicketEditModal}
          onClose={this.handleTicketClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Edit Ticket</DialogTitle>
          <DialogContent>
            <TextField 
              id='standard-basic'
              type='text'
              autoComplete='off'
              name='category'
              value={this.state.category}
              onChange={this.onChange}
              placeholder='Category'
              required
            /><br/>
            <TextField
              id='standard-basic'
              type='text'
              autoComplete='off'
              name='subCategory'
              value={this.state.subCategory}
              onChange={this.onChange}
              placeholder='Sub Category'
              required
            /><br/>
            <TextField
                id='standard-basic'
                type='text'
                autoComplete='off'
                name='description'
                value={this.state.description}
                onChange={this.onChange}
                placeholder='Description'
                required
            /><br/>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleTicketEditClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.category === '' || this.state.subCategory === '' || this.state.description === ''}
              onClick={(e) => this.updateTicket()} color="primary" autoFocus>
              Edit Ticket
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Product */}
        <Dialog
          open={this.state.openTicketModal}
          onClose={this.handleTicketClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Create Ticket</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="category"
              value={this.state.category}
              onChange={this.onChange}
              placeholder="Category"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="subCategory"
              value={this.state.subCategory}
              onChange={this.onChange}
              placeholder="sub Category"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="description"
              value={this.state.description}
              onChange={this.onChange}
              placeholder="Description"
              required
            /><br />
           
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleTicketClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.category === '' || this.state.subCategory === '' || this.state.description === '' }
              onClick={(e) => this.createTicket()} color="primary" autoFocus>
              Create Ticket
            </Button>
          </DialogActions>
        </Dialog>

        <br />

        <TableContainer>
         
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Sub Category</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.tickets.map((row) => (
                <TableRow key={row.category}>
                  <TableCell align="center" component="th" scope="row">
                    {row.category}
                  </TableCell>
                  <TableCell align="center">{row.subCategory}</TableCell>
                  <TableCell align="center">{row.description}</TableCell>
                  <TableCell align="center">
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={(e) => this.handleTicketEditOpen(row)}
                    >
                      Edit
                  </Button>
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={(e) => this.deleteTicket(row._id)}
                    >
                      Delete
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />
        </TableContainer>
                <Footer/>
      </div>
    );
  }
}

export default withRouter(Dashboard);












// import React, { Component } from "react";
// import {
//   Button,
//   TextField,
//   Dialog,
//   DialogActions,
//   LinearProgress,
//   DialogTitle,
//   DialogContent,
//   TableBody,
//   Table,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TableCell,
// } from "@material-ui/core";
// import { Pagination } from "@material-ui/lab";
// import swal from "sweetalert";
// import { withRouter } from "./utils";

// import "./Dashboard.css";
// const axios = require("axios");

// class Dashboard extends Component {
//   constructor() {
//     super();
//     this.state = {
//       token: "",
//       openTicketModal: false,
//       openTicketEditModal: false,
//       id: "",
//       category: "",
//       subCategory: "",
//       description: "",
//       search: "",
//       page: 1,
//       tickets: [],
//       pages: 0,
//       loading: false,
//     };
//   }

//   componentDidMount = () => {
//     let token = localStorage.getItem("token");
//     if (!token) {
//       this.props.navigate("/login");
//     } else {
//       this.setState({ token: token }, () => {
//         this.get();
//       });
//     }
//   };

//   get = () => {
//     this.setState({ loading: true });

//     let data = "?";
//     data = `${data}page=${this.state.page}`;
//     if (this.state.search) {
//       data = `${data}&search=${this.state.search}`;
//     }

//     axios
//       .get(`http://127.0.0.1:2000/get${data}`, {
//         headers: {
//             'content-type': 'multipart/form-data',
//           'token': this.state.token
//         },
//       })
//       .then((res) => {
//         this.setState({
//           loading: false,
//           tickets: res.data.tickets,
//           pages: res.data.pages,
//         });
//       })
//       .catch((err) => {
//         swal({
//             text: err.response.data.errorMessage,
//             icon: "error",
//             type: "error"
//         });
//         this.setState({ loading: false, tickets: [], pages: 0 }, () => {});
//       });
//   };

//   delete = (id) => {
//     axios
//       .post(
//         "http://localhost:2000/delete",
//         {
//           id: id,
//         },
//         {
//           headers: {
//             'content-type': 'multipart/form-data',
//             'token': this.state.token
//           },
//         }
//       )
//       .then((res) => {
//         swal({
//           text: res.data.title,
//           icon: "success",
//           type: "success",
//         });

//         this.setState({ page: 1 }, () => {
//           this.pageChange(null, 1);
//         });
//       })
//       .catch((err) => {
//         swal({
//           text: err.response.data.errorMessage,
//           icon: "error",
//           type: "error",
//         });
//       });
//   };

//   pageChange = (e, page) => {
//     this.setState({ page: page }, () => {
//       this.get();
//     });
//   };

//   logOut = () => {
//     localStorage.setItem("token", null);
//     this.props.navigate("/");
//   };
//   onChange = (e) => {
//     this.setState({ [e.target.name]: e.target.value }, () => {});
//     if (e.target.name === "search") {
//       this.setState({ page: 1 }, () => {
//         this.get();
//       });
//     }
//   };

//   create = () => {
//     const file = new FormData();
//     file.append("category", this.state.category);
//     file.append("subCategory", this.state.subCategory);
//     file.append("description", this.state.description);
  
//     axios
//       .post("http://localhost:2000/create", file, {
//         headers: {
//           'token': this.state.token
//         },
//       })
//       .then((res) => {
//         console.log(res.data);
//         swal({
//           text: res.data.title,
//           icon: "success",
//           type: "success"
//         });
  
//         this.handleTicketClose();
//         this.setState(
//           {
//             category: "",
//             subCategory: "",
//             description: "",
//             page: 1,
//           },
//           () => {
//             this.get();
//           }
//         );
//       })
//       .catch((err) => {
//         swal({
//           text: err.response.data.errorMessage,
//           icon: "error",
//           type: "error"
//         });
//         this.handleTicketClose();
//       });
//   };
  
//   update = () => {
//     const file = new FormData();
//     file.append('id',this.state.id); 
//     file.append("category", this.state.category);
//     file.append("subCategory", this.state.subCategory);
//     file.append("description", this.state.description);

//     axios
//       .post("http://localhost:2000/update", file, {
//         headers: {
//             'content-type': 'multipart/form-data',
//             'token': this.state.token
//         },
//       })
//       .then((res) => {
//         swal({
//           text: res.data.title,
//           icon: "success",
//           type: "success",
//         });
//         this.handleTicketEditClose();
//         this.setState(
//           {
//             category: "",
//             subCategory: "",
//             description: "",
//             file:null
//           },
//           () => {
//             this.get();
//           }
//         );
//       })
//       .catch((err) => {
//         swal({
//           text: err.response.data.errorMessage,
//           icon: "error",
//           type: "error",
//         });
//         this.handleTicketEditClose();
//       });
//   };

//   handleTicketOpen = () => {
//     this.setState({
//       openTicketModal: true,
//       id: "",
//       category: "",
//       subCategory: "",
//       description: "",
//     });
//   };

//   handleTicketClose = () => {
//     this.setState({
//       openTicketModal: false,
//     });
//   };

//   handleTicketEditOpen = (data) => {
//     this.setState({
//       openTicketEditModal: true,
//       id: data._id,
//       category: data.category,
//       subCategory: data.subCategory,
//       description: data.description,
//     });
//   };

//   handleTicketEditClose = () => {
//     this.setState({ openTicketEditModal: false });
//   };

//   render() {
//     return (
//       <div>
//         {this.state.loading && <LinearProgress size={40} />}
//         <div>
         
//           <div className="logout-btn">
//             <Button
//               className="button_style"
//               variant="contained"
//               size="small"
//               onClick={this.logOut}
//             >
//               Log Out
//             </Button>
//           </div>
//           <form className="form-group">
//             <table>
//               <tbody>
//                 <tr>
//                   <td>
//                     <label>Create Ticket :</label>
//                   </td>
//                   <td>
//                     <Button
//                       className="button_style"
//                       variant="contained"
//                       color="primary"
//                       size="small"
//                       onClick={this.handleTicketOpen}
//                     >
//                       Create Ticket
//                     </Button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </form>
//         </div>

//         {/* edit ticket  */}

//         <Dialog
//           open={this.state.openTicketEditModal}
//           onClose={this.handleTicketClose}
//           aria-labelledby="alert-dialog-title"
//           aria-describedby="alert-dialog-description"
//         >
//           <DialogTitle id="alert-dialog-title">Edit Ticket</DialogTitle>

//           <DialogContent>
//             <TextField
//               id="standard-basic"
//               type="text"
//               autoComplete="off"
//               name="category"
//               value={this.state.category}
//               onChange={this.onChange}
//               placeholder="Category"
//               required
//             />
//             <br />
//             <TextField
//               id="standard-basic"
//               type="text"
//               autoComplete="off"
//               name="subCategory"
//               value={this.state.subCategory}
//               onChange={this.onChange}
//               placeholder="Sub Category"
//               required
//             />
//             <br />
//             <TextField
//               id="standard-basic"
//               type="text"
//               autoComplete="off"
//               name="description"
//               value={this.state.description}
//               onChange={this.onChange}
//               placeholder="Description"
//               required
//             />
//             <br />
//           </DialogContent>

//           <DialogActions>
//             <Button onClick={this.handleTicketEditClose} color="primary">
//               Cancel
//             </Button>
//             <Button
//               disabled={
//                 this.state.category === "" ||
//                 this.state.subCategory === "" ||
//                 this.state.description === ""
//               }
//               onClick={(e) => this.update()}
//               color="primary"
//               autoFocus
//             >
//               Edit Ticket
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* create ticket  */}

//         <Dialog
//           open={this.state.openTicketModal}
//           onClose={this.handleTicketClose}
//           aria-labelledby="alert-dialog-title"
//           aria-describedby="alert-dialog-description"
//         >
//           <DialogTitle id="alert-dialog-title">Create Ticket</DialogTitle>
//           <DialogContent>
//             <TextField
//               id="standard-basic"
//               type="text"
//               autoComplete="off"
//               name="category"
//               value={this.state.category}
//               onChange={this.onChange}
//               placeholder="Category"
//               required
//             />
//             <br />
//             <TextField
//               id="standard-basic"
//               type="text"
//               autoComplete="off"
//               name="subCategory"
//               value={this.state.subCategory}
//               onChange={this.onChange}
//               placeholder="Sub Category"
//               required
//             />
//             <br />
//             <TextField
//               id="standard-basic"
//               type="text"
//               autoComplete="off"
//               name="description"
//               value={this.state.description}
//               onChange={this.onChange}
//               placeholder="Description"
//               required
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={this.handleTicketClose} color="primary">
//               Cancel
//             </Button>
//             <Button
//               disabled={
//                 this.state.category === "" ||
//                 this.state.subCategory === "" ||
//                 this.state.description === ""
//               }
//               onClick={(e) => this.create()}
//               color="primary"
//               autoFocus
//             >
//               Create Ticket
//             </Button>
//           </DialogActions>
//         </Dialog>

//         <br />

//         <TableContainer>
//           <Table aria-label="simple table">
//             <TableHead>
//               <TableRow>
//                 <TableCell align="center">Category</TableCell>
//                 <TableCell align="center">Sub Category</TableCell>
//                 <TableCell align="center">Description</TableCell>
//                 <TableCell align="center">Action</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {this.state.tickets.map((row) => (
//                 <TableRow key={row.category}>
//                   <TableCell align="center" component="th" scope="row">
//                     {row.category}
//                   </TableCell>
//                   <TableCell align="center">{row.subCategory}</TableCell>
//                   <TableCell align="center">{row.description}</TableCell>
//                   <TableCell align="center">
//                     <Button
//                       className="button_style"
//                       variant="outlined"
//                       color="primary"
//                       size="small"
//                       onClick={(e) => this.handleTicketEditOpen(row)}
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       className="button_style"
//                       variant="outlined"
//                       color="secondary"
//                       size="small"
//                       onClick={(e) => this.delete(row._id)}
//                     >
//                       Delete
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           <br />
//           <Pagination
//             count={this.state.pages}
//             page={this.state.page}
//             onChange={this.pageChange}
//             color="primary"
//           />
//         </TableContainer>
//       </div>
//     );
//   }
// }

// export default withRouter(Dashboard);
