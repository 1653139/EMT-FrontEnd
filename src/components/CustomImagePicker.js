import React, { useState, useEffect, useRef } from 'react';
import { CameraOutlined } from '@ant-design/icons';
import { Tooltip, Button } from 'antd';


var isHover = false
export const CustomImagePicker = ({imgSrc, width='100%', height='100%', btnSize='50px',iconSize='40px', onImageChange}) => {

    const [img, setImg] = useState(imgSrc)
    const [overlay,setOverlay] = useState(false)

    const inputFile = useRef(null) 

    useEffect(() => {
        setImg(imgSrc)
       }, [imgSrc]);


    function onHover(){
        if (isHover==true)
        return
        setOverlay(true)
        console.log('hover')
    }

    function onMouseOut(){
        
        setOverlay(false)
        console.log('out')
    }

    
    function onClick(){
        inputFile.current.click();
    }

    function handleChange(event) {
        setImg(URL.createObjectURL(event.target.files[0]))
        
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); 
        reader.onloadend = function() {
            var base64data = reader.result;          
            imgSrc=base64data   
            console.log(base64data);
            
            onImageChange(base64data)
        }
        
      }

    return (
            <div style={{position: 'relative'}} onPointerEnter={onHover} onPointerLeave={onMouseOut} >
                <img src={img} alt={img} style={{width: width, height: height }}
                />
                 {
                overlay===true?
                <div style={{position:'absolute', top: 0, left:0, width: '100%', height: '100%', backgroundColor:'rgba(0, 0, 0, 0.7)' }}>
                    <Tooltip placement="bottom" title={"Click to change image"} color='#f50'>
                        <div style={{width:btnSize, height:btnSize, position:'absolute',top:0, left:0,bottom:0,right:0,margin:'auto'}}>
                            <CameraOutlined onClick={onClick} style={{width:btnSize, height:btnSize, fontSize:iconSize, color:'#FD632C',position:'absolute',top:0, left:0,bottom:0,right:0,margin:'auto'}}/>
                            <input onChange={handleChange} type='file' id='file' ref={inputFile} style={{display: 'none'}}/>
                        </div>
                    </Tooltip>
                </div>
                :null
           }
            </div>
    
    )
}