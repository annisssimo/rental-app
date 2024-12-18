import '../../styles/Main.css';
import noPhoto from '../../img/no-photo.png';

function PrimiseList({ premises }) {
  return (
    <div className="primesController">
      <div className="primiseList">
        {Array.isArray(premises) &&
          premises.map((premise) => (
            <a
              key={premise.ID}
              href={`/premise/${premise.ID}`}
              className="primise"
            >
              {premise.Image !== 'data:image/png;base64,null' ? (
                <img src={premise.Image} alt="" />
              ) : (
                <img src={noPhoto} alt="Placeholder" />
              )}
              <div>{premise.Name}</div>
              <div>{premise.Price}</div>
            </a>
          ))}
      </div>
    </div>
  );
}

export default PrimiseList;
