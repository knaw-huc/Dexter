import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import Container from "@mui/material/Container"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import MenuItem from "@mui/material/MenuItem"
import ScienceIcon from "@mui/icons-material/Science"
import LoginIcon from "@mui/icons-material/Login"
import {useContext} from "react"
import {userContext} from "../State/User/userContext"
import {useNavigate} from "react-router-dom"

const pages = ["corpora", "sources"]
const settings = ["account"]

export default function Header() {
    const navigate = useNavigate()
    const username = useContext(userContext).userState.username

    return <AppBar position="static">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                <ScienceIcon
                    onClick={() => navigate("/")}
                    sx={{display: {xs: "none", md: "flex"}, mr: 0.5}}
                />
                <Typography
                    onClick={() => navigate("/")}
                    variant="h6"
                    noWrap
                    component="a"
                    href="#app-bar-with-responsive-menu"
                    sx={{
                        mr: 2,
                        display: {xs: "none", md: "flex"},
                        fontFamily: "monospace",
                        fontWeight: 700,
                        letterSpacing: ".3rem",
                        color: "inherit",
                        textDecoration: "none",
                    }}
                >
                    DEXTER
                </Typography>
                <Box sx={{flexGrow: 1, display: {xs: "none", md: "flex"}}}>
                    {username && pages.map((page) => (
                        <Button
                            key={page}
                            onClick={() => navigate("/" + page)}
                            sx={{my: 2, color: "white", display: "block"}}
                        >
                            {page}
                        </Button>
                    ))}
                </Box>
                {username
                    ? <UserMenuAvatar/>
                    : <LoginAvatar/>
                }
            </Toolbar>
        </Container>
    </AppBar>
}

function LoginAvatar() {
    const navigate = useNavigate()

    return <Box sx={{flexGrow: 0}}>
        <IconButton onClick={() => navigate("/login")} sx={{p: 0}}>
            <Avatar>
                <LoginIcon/>
            </Avatar>
        </IconButton>
    </Box>
}

function UserMenuAvatar() {
    const username = useContext(userContext).userState.username

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget)
    }

    return <Box sx={{flexGrow: 0}}>
        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
            <Avatar
                alt={username
                    ? username[0].toUpperCase()
                    : "Anonymous"
                }
                src="/static/images/avatar/2.jpg"
            />
        </IconButton>
        <Menu
            sx={{mt: "45px"}}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
        >
            {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
            ))}
        </Menu>
    </Box>
}