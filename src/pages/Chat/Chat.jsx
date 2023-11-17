// Importation des bibliothèques nécessaires depuis React et d'autres modules
import React, { useEffect, useState } from 'react';
import { OpenAI } from 'openai';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

// Récupération de la clé API depuis les variables d'environnement
const APIKey = import.meta.env.local.VITE_REACT_APP_OPENAI_API_KEY;

// Définition du composant Chat
function Chat() {
    // Récupération de l'objet location et de la fonction navigate depuis react-router-dom
    const location = useLocation();
    const navigate = useNavigate();

    // Récupération des données du formulaire depuis l'état de l'emplacement (location)
    const formData = location.state?.formData;

    // Déclaration des états pour stocker la réponse de l'API, le chargement et les données de la question
    const [apiResponse, setApiResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [QuestData, setQuestData] = useState("");

    // Initialisation de l'objet OpenAI avec la clé API
    const openai = new OpenAI({
        apiKey: APIKey,
        dangerouslyAllowBrowser: true,
    });

    // Fonction appelée lors de la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le comportement par défaut du formulaire
        setLoading(true); // Active le chargement

        try {
            // Appel à l'API OpenAI pour obtenir une réponse en fonction des messages fournis
            const result = await openai.chat.completions.create({
                model: "gpt-4-1106-preview",
                messages: [
                    { role: 'system', content: `adresse toi a l'utilisateur avec son prénom ${formData.name}` },
                    { role: 'system', content: `Tu ne dois donner des réponses que si ça concerne strictement ${formData.subject}` },
                    { role: 'user', content: QuestData }
                ],
            });

            console.log(result); // Affiche le résultat dans la console (à des fins de débogage)
            
            // Mise à jour de l'état avec la réponse de l'API
            setApiResponse(result.choices[0].message.content);
        } catch (err) {
            // En cas d'erreur, mise à jour de l'état avec un message d'erreur
            setApiResponse("Something is going wrong, Please try again.");
;        } finally {
            setLoading(false); // Désactive le chargement, quelle que soit l'issue de la requête
        }
    }

    // Fonction appelée lorsqu'il y a un changement dans le champ de la question
    function handleQuestData(e) {
        setQuestData(e.target.value); // Met à jour l'état avec la valeur du champ de la question
    }

    // Effet déclenché lorsque le composant est monté ou que formData ou navigate change
    useEffect(() => {
        if (formData.name && formData.subject) {
            // Si le prénom et le sujet existent, déclenche une animation de confettis
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.5 },
            });
        } else {
            navigate('/'); // Redirige vers la page d'accueil si les données ne sont pas présentes
        }
    }, [formData, navigate]); // Dépendances de l'effet

    // Si formData n'est pas défini, retourne null (le composant ne rend rien)
    if (!formData) {
        return null;
    }

    // Rendu du composant Chat
    return (
        <main className="text-center">
            {/* Affichage du titre de bienvenue avec le prénom du formulaire */}
            <h1 className="form-signin col-md-6 col-sm-10 m-auto mb-3">
                Bienvenue, {formData.name}
            </h1>
            {/* Affichage du sous-titre avec le sujet du formulaire */}
            <h3>Pose-moi tes questions sur {formData.subject}</h3>
            {/* Formulaire avec un champ de texte pour poser une question */}
            <form>
                <div className="form-floating mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Pose ta question ici"
                        onChange={handleQuestData}
                    ></textarea>
                </div>
                {/* Bouton d'envoi du formulaire avec gestion de l'état de chargement et de la désactivation */}
                <button className='btn btn-warning rounded-pill' type="submit" onClick={handleSubmit} disabled={loading || QuestData.length === 0}>
                    {loading ? "Loading..." : "Envoyer"}
                </button>
            </form>
            {/* Section pour afficher la question et la réponse */}
            <section style={{maxWidth:'70vw', marginTop: '1rem', border: '1px solid black', borderRadius:'10px', padding: '0.5rem'}}>
                {/* Affichage de la question actuelle */}
                <h6>{QuestData}</h6>
                {/* Affichage de la réponse de l'API */}
                <p>{apiResponse}</p>
            </section>
        </main>
    )
}

// Exportation du composant Chat
export default Chat;
