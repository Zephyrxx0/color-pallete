import createCard from './createCard';

export default function slot() {

    const card = document.createElement('div');
    
    card.style.width = '250px';
    card.style.height = '400px';
    card.style.border = '2px solid #FFFFFF';
    card.style.borderRadius = " 8px "
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.justifyContent = 'center';
    card.style.alignItems = 'center';
    

    card.appendChild(createCard());
    card.appendChild(createCard());
    

}