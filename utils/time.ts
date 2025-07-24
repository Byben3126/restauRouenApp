export const timeElapsed = (date: string): string => {
    const maintenant = new Date();
    const difference = maintenant.getTime() - new Date(date).getTime(); // Différence en millisecondes

    const secondes = Math.floor(difference / 1000);
    const minutes = Math.floor(secondes / 60);
    const heures = Math.floor(minutes / 60);
    const jours = Math.floor(heures / 24);
    const mois = Math.floor(jours / 30); // Approximatif
    const annees = Math.floor(mois / 12);

    if (secondes < 60) return "<1min";
    if (minutes < 60) return `${minutes}min`;
    if (heures < 24) return `${heures}h`;
    if (jours < 30) return `${jours}j`;
    if (mois < 12) return `${mois} mois`;
    return `${annees} ans`;
};