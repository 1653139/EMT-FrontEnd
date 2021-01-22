
import React, { useState, useEffect, useContext  } from 'react';
import { Button, Avatar, List, Row, Col, Select, DatePicker, Divider,Input } from 'antd';
import {EventContext} from '../pages/view-event'
import ReactDOM from 'react-dom';
import {CloseOutlined,PlusOutlined} from '@ant-design/icons';
const { Option } = Select;

export const EditParticipant = ({isAddMore=true, isEnable=true, height='150px', listItem, actionBtnCallBack, searchFunc})=>{
    var displayItems = [...listItem]
    const [data, setData] = useState(listItem);
    const [currentVal, setValue] = useState(null);
    const [item, setItem] = useState(displayItems);
    const [newItem, setNewItem] = useState('');
    
    useEffect(() => {
        setItem(displayItems)
       }, [listItem]);
       
    const handleSearch = value => {
        if (value!=='') {
          var data = searchFunc(value,listItem)
          setData(data)
          displayItems = data
          setItem(displayItems)
        
        } else {
          setItem(listItem)
        }
      };
    
      const handleChange = value => {
        setValue(value)
      };

      const handleSelect = value => {
        if (value==='')
        {
            displayItems = listItem
            setItem(displayItems)
        }
        setValue(value)
        var i = searchFunc(value,listItem)[0];
        
        displayItems = []
        displayItems.push(i)
        setItem(displayItems)
      };

      function onRemoveClick(index){
        actionBtnCallBack(listItem[index])
        listItem.splice(index,1)
        setItem([...listItem])
        
      }


      const onNewItemChange = event => {
        var obj = {
          email: event.target.value,
          avatar: ''
        }
        setNewItem(obj)
      }

      function addItem(){
        listItem.push(newItem)
        setItem([...listItem])
        if(actionBtnCallBack)
          actionBtnCallBack()
      }

      function renderOption(){
          
        var options=[]
        for (const i in data)
          data[i].email? options.push(<Option key={data[i].email}>{data[i].email}</Option>):
          options.push(<Option key={data[i].name}>{data[i].name}</Option>)
        return options
      }

      function renderItemCell(){
            
        return ( <List
            style={{height:height,overflowY:'scroll'}}
            dataSource={item}
            renderItem={(i,index) => (
              <List.Item key={i.id}>
                 <div style={{ width:'100%', display: 'flex', alignItems: 'center',marginRight:'10px' }}>
                     <img style={{ width: '40px', height: '40px' }} src={i.logo?i.logo:i.avatar==''?'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/1200px-User_font_awesome.svg.png':i.avatar}></img>
                     <div style={{ marginLeft: '20px', width:'100%'}}>{i.email?i.email:i.name}</div>
                    {isEnable==true?<Button onClick={()=>{onRemoveClick(index)}} size={'small'} danger shape="circle" icon={<CloseOutlined/>}/>:null}
                 </div>
              </List.Item>
            )}
          >
          </List>)
      }

    return (
        <div>
            {
                isEnable?
                <div>
                    <Select
                    showSearch
                    value={currentVal}
                    style={{ width: '100%' }}
                    placeholder="Add more..."
                    optionLabelProp="label"
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={handleSearch}
                    onChange={handleChange}
                    onSelect={handleSelect}
                    notFoundContent={null}
                    >
                        {renderOption()}
                    </Select>
                    <Divider></Divider>
                </div>:
                null
            }
            {renderItemCell()}
            {
              isAddMore?
              <div>
                <Divider style={{ margin: '4px 0' }} />
                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                  <Input style={{ flex: 'auto' }} value={newItem.email} onChange={onNewItemChange}/>
                  <a
                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                    onClick={addItem}
                  >
                    <PlusOutlined /> Add item
                  </a>
                </div>
              </div>:
              null
            }
        </div>
    )
}
