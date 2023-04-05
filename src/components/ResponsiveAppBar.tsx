import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import * as React from 'react';
import useSession from 'src/hooks/useSession';
import SignOut from './SignOut';

interface Page {
  text: string;
  path: string;
}

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const session = useSession();
  const theme = useTheme();
  const router = useRouter();
  const authenticated = !!session?.data?.user;
  const pages: Page[] = authenticated ? [
    { text: 'My Board', path: '/' },
  ] : [];
  const settings = ['Profile'];


  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              mr: 2
            }}
          >
            <Link href='/'
              style={{
                display: 'flex',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              <Typography fontSize='1.5rem' fontWeight='700'>KanBomb</Typography>
            </Link>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <Link key={page.text} href={page.path} style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page.text}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Typography fontSize='1.5rem' fontWeight='700'>KanBomb</Typography>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link
                key={page.text}
                onClick={handleCloseNavMenu}
                style={{
                  marginInline: '.5rem',
                  color: theme.palette.text.primary,
                  display: 'block',
                  textDecoration: 'none'
                }}
                href={page.path}
              >
                {page.text}
              </Link>
            ))}
          </Box>
          {authenticated ? (<Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Profile Picture" src="/pfp-small.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <Link key={setting} href={'/' + setting.toLowerCase()} style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                </Link>
              ))}
              <MenuItem>
                <SignOut />
              </MenuItem>
            </Menu>
          </Box>) : (
            <Box sx={{ flexGrow: 0 }}>
              <IconButton onClick={() => router.push('/sign-in')} title="Sign In">
                <AccountCircleIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;