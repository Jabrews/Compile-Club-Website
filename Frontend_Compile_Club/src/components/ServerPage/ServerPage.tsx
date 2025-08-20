import {useState} from 'react'
import {motion} from 'framer-motion'
import { Ampersand } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {useGetUserFormsCount} from './hooks/useGetUserFormsCount'


import discord_logo from '../../assets/discord-server-pic.png'
import real_discord_logo from '../../assets/discord-logo-png-7617.png'
import gif from '../../assets/kitty.gif'

// components
import ServerModal from './ServerModal'

export default function ServerPage() {

    // hook init
    const { data } = useGetUserFormsCount();

    const [isShown, toggleIsShown] = useState(false)

    const navigate = useNavigate();

    const handleJoinBtn = () => {
        toggleIsShown(true)
    }

    const handleGoBackBtn = () => {
        navigate('/home'); 
    }


    return (
        <>
            <div>
                <p className='join-header'>
                    Join 
                </p>


                <div className='discord-container'>
                    <p className='server-header'> Discord <img src={real_discord_logo} /> </p>
                    <div className='discord-content'>
                        <img src={discord_logo} className='server-logo'/>
                        <div className='discord-card-words'>
                            <p className='server-name'> Compile-Club</p>
                            <p className='server-bio'> 
                                A dev community based in Roanaoke VA, for collaboration, support, and talkin.    
                            </p>   
                        </div>                                  
                    </div>
                    <motion.button
                    className="join-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={handleJoinBtn}
                    >
                    Get Join Link <Ampersand className="btn-icon" size={18} />
                    </motion.button>            
                </div>

                <div className='form-stat-container'>
                    <div className='stat-text'>
                        <p> forms submitted : </p>
                        <p> {data?.count ? data.count : 'couldnt find form count'} </p>
                    </div>
                    <motion.button 
                    className='back-btn'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={handleGoBackBtn}
                    >
                        Go Back <ArrowLeft size={18} />
                    </motion.button>
                </div>

                <img src={gif} className='gif' />


                

            </div>

            {isShown && 
                <ServerModal isShown={isShown} toggleIsShown={toggleIsShown}/> 
            }
        </>
    )


}