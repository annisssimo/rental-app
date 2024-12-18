import '../../styles/Premise.css';
import noPhoto from '../../img/no-photo.png';

function PremiseInfo({premise}) {
	if (!premise || !premise.DescriptionCharacteristicRef) {
		return <div>Loading...</div>; 
	  }

	return (
			<div className="premiseInfo">
                {premise.Image !== 'data:image/png;base64,null' ? ( <img src={premise.Image} alt="" className="premisePicture"/>) : (<img src={noPhoto} alt="Placeholder" className="premisePicture"/>)}
				<p className="namePremise">{premise.Name}</p>
				<p className="adressPremise">{premise.Address}</p>
				<div className="descriptionPremise">
					{premise.DescriptionCharacteristicRef.map((des) => (
						<div>
							<p className="char">{des.Characteristic.Name}:</p>
							<p className="des">{des.Description}</p>
						</div>
					))}
				</div>
			</div>
  	);
}

export default PremiseInfo;