import addsquare from '../../assets/icons/addSquare.svg'
import slot from './slots';


export default function addColorSlot() {
    
    const numberOfSlots = 2;
    
    const addColorSlotBtn = new DOMParser().parseFromString(addsquare, 'image/svg+xml').documentElement;
    const slotContainer = document.createElement('div');


    const height = 100 / numberOfSlots; 


    slotContainer.style.width = '100%';
    slotContainer.style.height = `${height}%`;
    slotContainer.style.display = 'flex';
    slotContainer.style.margin = '4px';

    slotContainer.style.justifyContent = 'center';
    slotContainer.style.alignItems = 'center';
    slotContainer.appendChild(addColorSlotBtn);



}