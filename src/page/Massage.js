import React, { useEffect, useState } from 'react';
import NewMessage from '../component/NewMessage';
import { getMassage, getRoom } from '../component/Hfortapi'
const Massage = () => {
    const [massage, setMassage] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        let isApiSubscribed = true;
        const fetchMassage = async () => {
            let result = await getMassage(massage);
            if (isApiSubscribed) {
                setMassage(result.data);
            }
        }
        fetchMassage();

        const fetchRoomItem = async () => {
            let result = await getRoom();
            if (isApiSubscribed) {
                let perm = [];
                let room = result.data
                room.forEach(roomData => {
                    perm[roomData.id] = roomData;
                });
                setRooms(perm);
            }
        }

        fetchRoomItem()
        return () => {
            isApiSubscribed = false;
        }
    }, []);

    return (
        <>
            <div className='bg-light text-dark  fixed-top top-0 start-50 translate-middle-x w-75 ms-5'>
                <div className="float-start"><h1 className='mb-3'><i className='fas fa-chevron-right me-3'></i>Massage</h1></div>
                <div className="float-end"><button type="" className="btn btn-light" onClick={() => { setModalOpen(true) }}><i className="fas fa-plus-circle fa-2x"></i></button></div>
                {modalOpen && <NewMessage setOpenModal={setModalOpen} />}
            </div>
            <div className='m-auto position-absolute top-0 start-50 translate-middle-x w-75 mt-5 ms-5 p-5'>
                <table className="table table-bordered table-responsive ">
                    <thead className='table-dark'>
                        <tr className='text-center'>
                            <th scope="col">Room</th>
                            <th scope="col">Read</th>
                            <th scope="col">Title</th>
                            <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            massage.map((room) =>
                                <tr key={room.id} className='text-center'>
                                    {/* <td>{rooms.length > 0 && rooms[room.room].room_number || '-'}</td> */}
                                    <td>{(room.room in rooms) && rooms[room.room]['room_number'] || '-'}</td>
                                    <td>{room.read}</td>
                                    <td>{room.title}</td>
                                    <td>{room.date_created}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Massage;