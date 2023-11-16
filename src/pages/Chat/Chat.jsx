import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import ChatbotApp from './ChatbotApp';

function Chat() {
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state?.formData;

    useEffect(() => {
        if (!formData || !formData.name) {
            // Gérer le cas où formData n'est pas défini ou formData.name est absent
            console.error("Erreur: Les données du formulaire ne sont pas valides.");
            navigate('/'); // Rediriger vers la page d'accueil en cas d'erreur
        } else {
            // Effectuer l'animation uniquement si les données du formulaire sont valides
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        }
    }, [formData, navigate]);

    if (!formData) {
        // Si formData est toujours indéfini, vous pouvez gérer cela ici
        return <div>Chargement...</div>;
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
                    ></textarea>
                </div>
                <button className='btn btn-warning rounded-pill' type="submit">Envoyer</button>
            </form>

            <ChatbotApp />
        </main>
    );
}

export default Chat;
