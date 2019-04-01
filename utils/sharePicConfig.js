let drawShipData = 
[
  {
    "type": "image",
    "src": "/resource/share-ship-bg.png",
    "x": 0,
    "y": 0,
    "w": 375,
    "h": 667
  },
  {
    "type": "text",    
    "id":"shipNum",
    "fontSize": 17,
    "color": "#000",
    "align": "left",
    "x": 120,
    "y": 115
  },
  {
    "type": "text",
    "id":"emptyTime",
    "fontSize": 14,
    "color": "#000",
    "align": "left",
    "x": 120,
    "y": 145
  },
  {
    "type": "text",
    "id":"capability",
    "fontSize": 14,
    "color": "#000",
    "align": "left",
    "x": 120,
    "y": 180
  },
  {
    "type": "text",    
    "id":"emptyAddr",
    "fontSize": 14,
    "color": "#000",
    "align": "left",
    "x": 120,
    "y": 215
  },
  {
    "type": "image",
    "id":"headPic",
    "needCircly":true,
    "x": 80,
    "y": 360,
    "w": 40,
    "h": 40
  },
  {
    "type": "text",
    "text": "联系人:",
    "fontSize": 14,
    "color": "#ccc",
    "align": "left",
    "x": 130,
    "y": 387
  },
  {
    "type": "text",
    "id":"nick",
    "fontSize": 14,
    "color": "#000",
    "align": "left",
    "x": 180,
    "y": 387
  },
  {
    "type": "image",
    "id":"wxQr",
    "x": 137,
    "y": 500,
    "w": 100,
    "h": 100
  }
]


let drawGoodsData = 
[
  {
    "type": "image",
    "src": "/resource/share-goods-bg.png",
    "x": 0,
    "y": 0,
    "w": 375,
    "h": 667
  },
  {
    "type": "text",    
    "id":"goodsName",
    "fontSize": 17,
    "color": "#24252a",
    "align": "left",
    "x": 130,
    "y": 115
  },
  {
    "type": "text",
    "id":"goodsCount",
    "fontSize": 14,
    "color": "#24252a",
    "align": "left",
    "x": 130,
    "y": 147
  },
  {
    "type": "text",
    "id":"uploadDate",
    "fontSize": 14,
    "color": "#24252a",
    "align": "left",
    "x": 130,
    "y": 180
  },
  {
    "type": "text",    
    "id":"transFee",
    "fontSize": 14,
    "color": "#24252a",
    "align": "left",
    "x": 130,
    "y": 210
  },
  {
    "type": "text",    
    "id":"startAddr",
    "fontSize": 14,
    "color": "#24252a",
    "align": "left",
    "x": 130,
    "y": 244
  },
  {
    "type": "text",    
    "id":"destAddr",
    "fontSize": 14,
    "color": "#24252a",
    "align": "left",
    "x": 130,
    "y": 278
  },
  {
    "type": "image",
    "id":"headPic",
    "needCircly":true,
    "x": 80,
    "y": 360,
    "w": 40,
    "h": 40
  },
  {
    "type": "text",
    "text": "联系人:",
    "fontSize": 14,
    "color": "#999",
    "align": "left",
    "x": 130,
    "y": 387
  },
  {
    "type": "text",
    "id":"nick",
    "fontSize": 14,
    "color": "#24252a",
    "align": "left",
    "x": 180,
    "y": 387
  },
  {
    "type": "image",
    "id":"wxQr",
    "x": 137,
    "y": 495,
    "w": 100,
    "h": 100
  }
]

export function shareShipData(obj) {
  let data = drawShipData
  Object.keys(obj).forEach(key => {
    let value = obj[key]
    let items = data.filter(tmp => tmp.id === key)
    if (items && items.length > 0) {
      if (key === 'wxQr' || key === 'headPic') {        
        if (value && value.startsWith('https://')) {
          items[0].srcNeedDownload = true
        }
        items[0].src = value
      } else {
        items[0].text = value
      }
    }
  })

  let left = 120
  let top = 250
  for (let i = 0; i < obj.destAddrList.length; i ++) {
    if (i % 2 === 1) {
      left = 230
    } else {
      left = 120
      top = 250 + parseInt(i/2) * 30
    }    
    data.push({
      type: "text",
      text: obj.destAddrList[i],
      "fontSize": 14,
      "color": "#000",
      "align": "left",
      "x": left,
      "y": top
    })
  }
  return data
}


export function shareGoodsData(obj) {
  let data = drawGoodsData
  Object.keys(obj).forEach(key => {
    let value = obj[key]
    if (key === 'wxQr' || key === 'headPic') {
      if (value && value.startsWith('https://')) {
        data.filter(tmp => tmp.id === key)[0].srcNeedDownload = true
      }
      data.filter(tmp => tmp.id === key)[0].src = value
    } else {
      data.filter(tmp => tmp.id === key)[0].text = value
    }
  })
  return data
}

export function drawCanvas(ctx, data, callBack) {  
    ctx.scale(2, 2)
    let promiseList = []
    data.forEach(item => {
      if (item.color) {
        ctx.setFillStyle(item.color)
      }
      let left = item.x >= 0 ? item.x : 0
      let top = item.y >= 0 ? item.y : 0
      if (item.type === 'rect' && item.w > 0 && item.h > 0) {
        ctx.rect(0, 0, item.w, item.h)
        ctx.fill()
      } else if (item.type === 'text' && item.text && item.text.length > 0) {
        if (item.fontSize) {
          ctx.setFontSize(item.fontSize)
        }  
        if (item.align) {
          ctx.setTextAlign(item.align)
        }
        ctx.fillText(item.text, left, top)
      } else if (item.type === 'image' && item.src && item.src.length >= 0 && item.w > 0 && item.h > 0) {                
        if (item.srcNeedDownload) {
          let w = item.w
          let h = item.h          
          let promise = new Promise((resolve, reject) => {                        
            wx.downloadFile({
              url: item.src,
              success: function(res) {
                ctx.save()
                ctx.beginPath()                
                ctx.arc(left+w/2, top+h/2, w/2, 0, 2*Math.PI)  
                ctx.setFillStyle('#fff')              
                ctx.fill()
                ctx.clip()
                ctx.drawImage(res.tempFilePath, left, top, item.w, item.h)
                ctx.restore()                
                resolve()
              },
              fail:reject
            })
          })
          promiseList.push(promise)         
        } else {
          ctx.drawImage(item.src, left, top, item.w, item.h)
        }        
      }
    })

    if (promiseList.length > 0) {
        Promise.all(promiseList).then(() => {
          ctx.draw(false, callBack)
        }, (err) => {
          wx.showToast({title:'图片生成失败', icon:'none'})
        }).catch(() => {          
        })
    } else {
      ctx.draw(false, callBack)
    } 
  }