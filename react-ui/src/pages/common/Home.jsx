import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';

const Home = ({ user }) => {
    return (
        <Layout user={user}>
            <div className="mid-section" style={{ position: 'relative', width: '100%', height: '690px', marginTop: '60px', overflow: 'hidden' }}>
                <img
                    className="mid-image"
                    src="/static/images/home.jpg"
                    alt="Home"
                    style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        zIndex: 1,
                        display: 'block',
                        margin: 0,
                        padding: 0
                    }}
                />

                <div className="quote" style={{
                    position: 'absolute',
                    top: '50%',
                    left: '10%',
                    width: '40%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: "'Bebas Neue', serif",
                    fontSize: '30px',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                    lineHeight: 1.4,
                    margin: 0,
                    padding: 0
                }}>
                    "Books should go where they will be most appreciated,
                    not sit unread gathering dust on a forgotten shelf"
                </div>

                <div className="postcard" style={{
                    position: 'absolute',
                    top: '50%',
                    right: '5%',
                    width: '30%',
                    minHeight: '300px',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    backgroundColor: 'rgba(33, 33, 36, 0.76)',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '25px 20px',
                    textAlign: 'center',
                    margin: 0
                }}>
                    <h1>Grab A Book!</h1>
                    <hr />
                    <p>
                        An online portal for exchanging used books from university peeps
                        around you!
                    </p>
                    <Link to="/signin">
                        <div className="button">
                            <div className="button-text">Buy A Book</div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="bottom-section" style={{
                fontFamily: 'sans-serif',
                fontSize: 'small',
                width: '100%',
                marginTop: 0,
                color: 'rgb(80, 79, 79)',
                padding: '30px 20px',
                backgroundColor: 'rgb(182, 176, 174)',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                boxSizing: 'border-box',
                minHeight: '150px'
            }}>
                <div className="left-footer" style={{
                    width: '50%',
                    maxWidth: '600px',
                    margin: 0,
                    padding: '0 20px 0 0',
                    boxSizing: 'border-box',
                    lineHeight: 1.6
                }}>
                    Grabook.com is a project created by Students as a project for the
                    CS-258 (Software Engineering)
                    <br />
                    This project is made exclusively to cater the needs of students who
                    don&apos;t want to spend money on new books or for easy availability of
                    some special books.
                </div>

                <div className="right-footer" style={{
                    width: '30%',
                    maxWidth: '300px',
                    margin: 0,
                    padding: 0,
                    boxSizing: 'border-box',
                    textAlign: 'right'
                }}>
                    <p style={{ margin: '0 0 10px 0', padding: 0, lineHeight: 1.6 }}>Group Name: G9</p>
                    <p style={{ margin: '0 0 10px 0', padding: 0, lineHeight: 1.6 }}>Address: IIT Indore</p>
                    <p style={{ margin: 0, padding: 0, lineHeight: 1.6 }}>Copyright © G9. All rights reserved</p>
                </div>
            </div>
        </Layout>
    )
}

export default Home;