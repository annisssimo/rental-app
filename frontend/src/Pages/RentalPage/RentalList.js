import '../../styles/Main.css';
import '../../styles/Rentals.css';


function RentalList({ rentals }) {
	return (
        <div className="userList">
            {Array.isArray(rentals) && rentals.map((rental) => (
                <a href={`/premise/${rental.Premise.ID}`} className="rental">
                    <img src={rental.Premise.Image}/>
                    <div className="name_price">
                        <div>{rental.Premise.Name}</div>
                        <div style={{marginTop: '25px'}}>{rental.Premise.Price} BYN</div>
                    </div>
                    <div className='rentalDate'>
                        {new Date(rental.StartDate).toLocaleDateString()}
                    </div>

                </a>
            ))}
            
        </div>
  	);
}

export default RentalList;