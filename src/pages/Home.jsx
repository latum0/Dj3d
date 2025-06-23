import React from 'react'
import Sales from '../components/ui/Sales';
import Hero from '../components/ui/Hero';
import './Home.css';
import BestS from '../components/ui/Best-selling';
import ImgDev from '../components/ui/ImgDev'
import AllProductsSection from '../components/ui/AllProductsSection'




const Home = () => {
    return (

        <div className="home-container">

            <Hero />
            <BestS name="Products" title="Bxplore Our Products" />
            <BestS name="This Month" title="Best Selling Products" />

            <ImgDev />
            <BestS name="Our Products" title="Best Selling Products" />



        </div>



    )
}

export default Home