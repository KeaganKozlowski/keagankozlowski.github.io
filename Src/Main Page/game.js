function increase(){
    const currencyAmount = document.getElementById('currency-amount');
    if (currencyAmount) {
        let currentAmount = parseInt(currencyAmount.textContent, 10) || 0; // Get current amount or default to 0
        currentAmount += 1; // Increment by 1
        currencyAmount.textContent = currentAmount; // Update the displayed amount
        currencyAmount.classList.add('up');
        setTimeout(() =>{
            currencyAmount.classList.remove('up')
        }, 500)
    } else {
        console.error('Element with ID "currency-amount" not found.');
    }
}