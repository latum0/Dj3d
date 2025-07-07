import React from 'react'

import Hero from '../components/ui/Hero';
import './Home.css';
import BestS from '../components/ui/Best-selling';
import New from '../components/ui/New';






const Home = () => {
    return (

        <div className="home-container">

            <Hero />
            <BestS name="Products" title="Bxplore Our Products" />
            <BestS name="This Month" title="Best Selling Products" />


            <BestS name="Our Products" title="Best Selling Products" />
            <New />


        </div>



    )
}

export default Home