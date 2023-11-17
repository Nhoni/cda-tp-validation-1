import React, { useEffect, useState } from 'react'
import { OpenAI } from 'openai'
import { useLocation, useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
const APIKey = import.meta.env.VITE_REACT_APP_OPENAI_API_KEY

function Chat() {
    const location = useLocation()
    const navigate = useNavigate()
    const formData = location.state?.formData

    const [apiResponse, setApiResponse] = useState("")
    const [loading, setLoading] = useState(false)
    const [QuestData, setQuestData] = useState("")

    const openai = new OpenAI({
        apiKey: APIKey, // defaults to process.env["OPENAI_API_KEY"]
        dangerouslyAllowBrowser: true,
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        console.log(formData.subject)
        try {
            const result = await openai.chat.completions.create({
                model: "gpt-4-1106-preview",
                messages: [
                    { role: 'system', content: `adresse toi a l'user avec son prenom ${formData.name}` },
                    { role: 'system', content: `Tu ne dois donnée des réponse que si ca concèrne strictement ${formData.subject}` },
                    { role: 'user', content: QuestData }
                ],
            })
            console.log(result)
            setApiResponse(result.choices[0].message.content)
        } catch (err) {
            setApiResponse("Something is going wrong, Please try again.");
        }
        setLoading(false);
    }

    function handleQuestData(e) {
        setQuestData(e.target.value)
    }

    useEffect(() => {
        if (formData.name && formData.subject) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            })
        } else {
            navigate('/')
        }
    }, [formData, navigate])

    if (!formData) {
        return null
    }

    return (
        <main className="text-center">
            <h1 className="form-signin col-md-6 col-sm-10 m-auto mb-3">
                Bienvenue, {formData.name}
            </h1>
            <h3>Pose-moi tes questions sur {formData.subject}</h3>
            <form>
                <div className="form-floating mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Pose ta question ici"
                        onChange={handleQuestData}
                    ></textarea>
                </div>
                <button className='btn btn-warning rounded-pill' type="submit" onClick={handleSubmit} disabled={loading || QuestData.length == 0}>{loading ? "Loading..." : "Envoyer"}</button>
            </form>
            <section style={{maxWidth:'70vw', marginTop: '1rem', border: '1px solid black', borderRadius:'10px', padding: '1rem'}}>
                <h6>{QuestData}</h6>
                <p>{apiResponse}</p>
            </section>
        </main>
    )
}


export default Chat