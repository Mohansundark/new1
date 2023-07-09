import React from 'react';
import { Container, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: '#f5f5f5',
    padding: theme.spacing(2),
    marginTop: theme.spacing(3),
    textAlign: 'center',
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="md">
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Help Desk. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
