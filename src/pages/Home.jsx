import React from 'react'
import Sales from '../components/ui/Sales';
import Hero from '../components/ui/Hero';
import './Home.css';
import BestS from '../components/ui/Best-selling';
import ImgDev from '../components/ui/ImgDev'
import AllProductsSection from '../components/ui/AllProductsSection'
import New from '../components/ui/New';



const Home = () => {
    return (

        <div className="home-container">

            <Hero />
            <Sales />
            <BestS />
            <ImgDev />
            <AllProductsSection />
            <New />


        </div>



    )
}

export default Home