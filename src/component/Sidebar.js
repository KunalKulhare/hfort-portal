import React from 'react';
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
    CDBSidebarFooter
} from 'cdbreact';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = (props) => {
    const auth = localStorage.getItem('access_token');
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/signin');
    }
    return (
        <>
            {auth ? <div style={{ display: 'flex', height: '100vh' }}>
                <CDBSidebar textColor="#fff" backgroundColor="#333">
                    <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                        <h2>{props.title}</h2>
                    </CDBSidebarHeader>
                    <CDBSidebarContent className="sidebar-content">
                        <CDBSidebarMenu>
                            <NavLink exact={"true"} to="/" className={({ isActive }) => (isActive ? 'activeClicked' : 'inactiveClicked')}>
                                <CDBSidebarMenuItem icon="fas fa-home">Dashboard</CDBSidebarMenuItem>
                            </NavLink>
                            <NavLink exact={"true"} to="/action" className={({ isActive }) => (isActive ? 'activeClicked' : 'inactiveClicked')}>
                                <CDBSidebarMenuItem icon="fa-regular fa-window-restore">Action</CDBSidebarMenuItem>
                            </NavLink>
                            <NavLink exact={"true"} to="/actiontype" className={({ isActive }) => (isActive ? 'activeClicked' : 'inactiveClicked')}>
                                <CDBSidebarMenuItem icon="fa-regular fa-window-maximize">Action Type</CDBSidebarMenuItem>
                            </NavLink>
                            <NavLink exact={"true"} to="/Navigations" className={({ isActive }) => (isActive ? 'activeClicked' : 'inactiveClicked')}>
                                <CDBSidebarMenuItem icon="fa-solid fa-info">TV APP Navigation</CDBSidebarMenuItem>
                            </NavLink>
                            <NavLink exact={"true"} to="/foodmenu" className={({ isActive }) => (isActive ? 'activeClicked' : 'inactiveClicked')}>
                                <CDBSidebarMenuItem icon="fas fa-concierge-bell">Food Menu</CDBSidebarMenuItem>
                            </NavLink>
                            <NavLink exact={"true"} to="/iptv" className={({ isActive }) => (isActive ? 'activeClicked' : 'inactiveClicked')}>
                                <CDBSidebarMenuItem icon="fas fa-tv">IPTV</CDBSidebarMenuItem>
                            </NavLink>
                            <NavLink exact={"true"} to="/massage" className={({ isActive }) => (isActive ? 'activeClicked' : 'inactiveClicked')}>
                                <CDBSidebarMenuItem icon="fas fa-envelope">Massage</CDBSidebarMenuItem>
                            </NavLink>
                            <NavLink exact={"true"} to="/worldclock" className={({ isActive }) => (isActive ? 'activeClicked' : 'inactiveClicked')}>
                                <CDBSidebarMenuItem icon="fa-solid fa-globe">World Clock</CDBSidebarMenuItem>
                            </NavLink>
                            <NavLink exact={"true"} to="/promotions" className={({ isActive }) => (isActive ? 'activeClicked' : 'inactiveClicked')}>
                                <CDBSidebarMenuItem icon="fa-solid fa-film">Promotions</CDBSidebarMenuItem>
                            </NavLink>
                        </CDBSidebarMenu>
                    </CDBSidebarContent>
                    <CDBSidebarFooter>
                        <CDBSidebarMenuItem icon="fas fa-sign-out-alt" onClick={logout} exact={"true"} to="/signin" activeClassName={({ isActive }) => (isActive ? 'activeClicked' : 'inactiveClicked')}>Sign Out</CDBSidebarMenuItem>
                    </CDBSidebarFooter>
                </CDBSidebar>
            </div>
                :
                <NavLink exact={"true"} to="/signin" className={({ isActive }) => (isActive ? 'activeClicked' : 'inactiveClicked')}></NavLink>
            }
        </>
    );
};

export default Sidebar;