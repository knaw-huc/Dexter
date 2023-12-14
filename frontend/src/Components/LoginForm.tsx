import * as React from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import {Alert, FormControl, Grid} from "@mui/material"
import TextField from "@mui/material/TextField"
import {useContext, useState} from "react"
import {login} from "../utils/API"
import {errorContext} from "../State/Error/errorContext"
import {userContext} from "../State/User/userContext"
import {Actions} from "../State/actions"
import Button from "@mui/material/Button"

export default function LoginForm() {
    const {setUser} = useContext(userContext)

    const [error, setError] = useState<Error>(null)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    function handleLogin() {
        if(!username && !password) {
            setError(new Error("Please fill in password and username"))
        }
        login(username, password)
            .then(() => setUser(
                {type: Actions.SET_USER, username}
            )).catch(setError)
    }

    return <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        style={{minHeight: "100vh"}}
    >
        <Grid item xs={3}>
            <Card sx={{width: 600}}>
                <CardContent>
                    <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                        Login
                    </Typography>
                    {error && <Alert severity="error">
                        Could not login: {error.message}
                    </Alert>}
                    <FormControl fullWidth sx={{mt: 1, mb: 1, }}>
                        <TextField
                            label="username"
                            id="outlined-basic"
                            variant="outlined"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            label="password"
                            id="outlined-basic"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <Button
                            variant="contained"
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                    </FormControl>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
}