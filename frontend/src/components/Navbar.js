import React from 'react';
import { AppBar, Toolbar, Button, Typography, makeStyles } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
    textAlign: 'left',
    
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/adminlogin');
  };

  const handleUserLogin = () => {
    navigate('/userlogin');
  };
  const handleClick = ()=>{
    navigate('/');
  }

  return (
    <AppBar position="sticky" style={{ top: 0 }}>
      <Toolbar>
        <Typography variant="h6" onClick={handleClick} className={classes.title}>
          Help Desk
        </Typography>
        <div className={classes.toolbar}>
          <Button color="inherit" className={classes.button} onClick={handleAdminLogin}>
            Admin Login
          </Button>
          <Button color="inherit" className={classes.button} onClick={handleUserLogin}>
            User Login
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
