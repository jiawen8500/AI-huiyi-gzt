export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin","*")
  res.setHeader("Access-Control-Allow-Methods","POST,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers","Content-Type")

  if(req.method==="OPTIONS") return res.status(200).end()

  try{

    const apiKey = process.env.OPENAI_API_KEY
    const base = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"

    const {model,messages,temperature} = req.body

    const r = await fetch(`${base}/chat/completions`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${apiKey}`
      },
      body:JSON.stringify({
        model:model || "gpt-4o-mini",
        messages,
        temperature:temperature || 0.2
      })
    })

    const data = await r.json()

    // 🔥 关键：保证返回 OpenAI 标准格式
    if(!data.choices){
      return res.status(200).json({
        choices:[
          {
            message:{
              content: JSON.stringify(data)
            }
          }
        ]
      })
    }

    return res.status(200).json(data)

  }catch(e){

    return res.status(500).json({
      choices:[
        {
          message:{
            content:"API调用失败："+String(e)
          }
        }
      ]
    })

  }

}
