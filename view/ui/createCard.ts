import addsquare from '../../assets/icons/addSquare.svg'
import slot from './slots';
import baseCard from './card';

export default function createCard() {
    const card = document.createElement('div');
    const addCardBtn = new DOMParser().parseFromString(addsquare, 'image/svg+xml').documentElement;

    // card styles
    card.style.width = '250px';
    card.style.height = '400px';
    card.style.border = '2px solid #FFFFFF';
    card.style.borderRadius = " 8px "
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.justifyContent = 'center';
    card.style.alignItems = 'center';
    
    // add button styles
    addCardBtn.style.cursor = 'pointer';
    addCardBtn.style.scale = '2';
    card.appendChild(addCardBtn);

    addCardBtn.addEventListener('click', () => {
        document.body.appendChild(baseCard());
        console.log('Add card button clicked');
    });



    return card;
}