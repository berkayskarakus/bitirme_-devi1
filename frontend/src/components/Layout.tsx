import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        PLOTIFY
                    </Typography>
                    <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                    <Button color="inherit" component={Link} to="/arazi">Arazi Seçimi</Button>
                    <Button color="inherit" component={Link} to="/Anasayfa">Anasayfa</Button>
                    <Button color="inherit" component={Link} to="/Belgeler">Belgeler</Button>
                    <Button color="inherit" component={Link} to="/Analiz">Analiz</Button>
                </Toolbar>
            </AppBar>

            <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                {/* Router tarafından seçilen sayfa (Outlet) burada render edilecek */}
                <Outlet />
            </Container>
        </Box>
    );
}