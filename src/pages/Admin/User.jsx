import React, { useState, useEffect } from 'react';
import './User.css';
import Header from '../../components/Header/Header';
import { assets } from '../../assets/assets';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import FormAddUser from '../../components/FormAddUser'; 

const User = () => {
    const [users, setUsers] = useState([]); 
    const [switches, setSwitches] = useState({}); 
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false); 

    const getUserIdFromToken = (token) => {
        try {
            const payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payload));
            return decodedPayload.UserId;
        } catch (error) {
            console.error("Unable to decode token:", error);
            return null;
        }
    };

    // Function to retrieve token from cookies
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    // Fetch user data from the backend when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = getCookie('access_token');
                console.log("Access Token:", token); // Log token
                if (!token) {
                    setError("Bạn cần đăng nhập để xem thông tin này.");
                    return;
                }

                const userId = getUserIdFromToken(token);
                console.log("UserId from Token:", userId); // Log userId
                if (!userId) {
                    setError("Không thể lấy userId từ token.");
                    return;
                }

                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/listUser`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log("Response Data:", response.data); // Log response data
                const userData = response.data.detailUserResponseList;
                if (!userData) {
                    throw new Error("Không có dữ liệu người dùng.");
                }

                setUsers(userData);

                const initialSwitchStates = {};
                userData.forEach(user => {
                    initialSwitchStates[user.userId] = user.isDeleted === 0;
                });
                setSwitches(initialSwitchStates);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError("Không thể lấy thông tin người dùng.");
            }
        };

        fetchUsers();
    }, []);


    // Handle switch state change
    const handleSwitchChange = (userId) => {
        const updatedSwitches = { ...switches, [userId]: !switches[userId] };
        setSwitches(updatedSwitches);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

     // Function to handle adding a new user
     const handleAddUserClick = () => {
        setIsFormOpen(true); // Show the form when clicking the button
    };

    // Function to close the form
    const handleCloseForm = () => {
        setIsFormOpen(false); // Close the form
    };

    const handleSubmitForm = (formData) => {
    console.log("User added:", formData);
    // Cập nhật lại danh sách người dùng nếu cần
    setUsers(prevUsers => [...prevUsers, formData]); // Hoặc lấy lại danh sách từ backend nếu cần
};


    return (
        <div className="user-table">
            <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} title="Tài khoản" />            
            {isFormOpen && <FormAddUser onClose={handleCloseForm} onSubmit={handleSubmitForm} />}
            <div className={`user-table-row ${isMenuOpen ? 'user-dimmed' : ''}`}>
                <div className="user-main-section">
                    <div className="user-box">
                        <div className="header-user-box">
                            <h2>Danh Sách Người Dùng</h2>
                            <button className="add-user-btn" onClick={handleAddUserClick}>Thêm người dùng +</button>
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <table>
                            <thead>
                                <tr>
                                    <th>Tên đăng nhập</th>
                                    <th>Họ và tên</th>
                                    <th>Vai trò</th>
                                    <th>Trạng thái hoạt động</th>
                                    <th>Cập nhật</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.userId}>
                                        <td>{user.userName}</td>
                                        <td>{user.fullName}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={switches[user.userId] || true}
                                                    onChange={() => handleSwitchChange(user.userId)}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <div className="button-container">
                                                <button className="user-update-btn3">Chi tiết</button>
                                                <button className="user-update-btn1">Cập nhật</button>
                                                <button className="user-update-btn2">Xóa</button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="user-stats-section">

                    <div className="user-stat-box1">
                        <div className="user-percentage-circle">
                            <div className="user-inner-circle"></div>
                            <span>70%</span>
                        </div>
                        <div className="user-stat-boxicon"></div>
                        <div className="user-stat-boxtext1">
                            <h3>Admin</h3>
                        </div>
                        <div className="user-stat-boxcount">
                            <h4></h4>
                        </div>
                        <div className="user-stat-boxdetails">
                            <h5>Last 24 Hours</h5>
                        </div>
                    </div>
                    <div className="user-stat-box2">
                        <div className="user-percentage-circle2">
                            <div className="user-inner-circle2"></div>
                            <span>80%</span>
                        </div>
                        <div className="user-stat-boxicon"></div>
                        <div className="user-stat-boxtext1">
                            <h3>Customer</h3>
                        </div>
                        <div className="user-stat-boxcount">
                            <h4></h4>
                        </div>
                        <div className="user-stat-boxdetails">
                            <h5>Last 24 Hours</h5>
                        </div>
                    </div>
                    <div className="user-stat-box3">
                        <div className="user-percentage-circle3">
                            <div className="user-inner-circle3"></div>
                            <span>60%</span>
                        </div>
                        <div className="user-stat-boxicon"></div>
                        <div className="user-stat-boxtext1">
                            <h3>Shipper</h3>
                        </div>
                        <div className="user-stat-boxcount">
                            <h4></h4>
                        </div>
                        <div className="user-stat-boxdetails">
                            <h5>Last 24 Hours</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default User;
