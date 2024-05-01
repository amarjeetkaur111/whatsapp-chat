import { useContext } from "react";
import { Container,Nav,Navbar,Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const { user, logOut }= useContext(AuthContext);    
    return (
        <Navbar bg="dark" className="mb-4" style={{height:'3.75em'}}>
            <Container>
                <h2>
                    <Link to='/' className="link-light text-decoration-none">ChatApp</Link>                    
                </h2>
                <span className="text-warning">Logged In as {user?.username}</span>
                <Nav>
                    <Stack direction="horizontal" gap='3'>
                        {user && 
                            <Link to='/logout' onClick={()=>logOut()} className="link-light text-decoration-none">Logout</Link>                    
                        }
                        {!user && (<>
                        <Link to='/login' className="link-light text-decoration-none">Login</Link>                    
                        <Link to='/register' className="link-light text-decoration-none">Register</Link>   </>)   
                        }              
                    </Stack>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavBar;