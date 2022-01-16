import './collectionDetails.css';

function CollectionDetails() {
  return (
    <div className="collection-details">
       <form className="collection-details-form">
          <label className="collection-name-label">
            Please enter the collection's name
          </label>
          <input type="text" className="collection-name-input" name="collection-name" />
          <label className="collection-desc-label">
            Please enter the collection's description
          </label>
          <input type="text" className="collection-desc-input" name="collection-desc" />
          <label className="collection-asset-size-label">
            Please enter the collection's asset size
          </label>
          <input type="text" className="collection-asset-size-input" name="collection-asset-size"/>
          <label className="collection-pixel-size-label">
            Please enter the collection's dimensions(in pixels)
          </label>
          <label className="collection-pixel-size-label">
            X(in pixels)
          </label>
          <input type="text" className="collection-pixel-size-input" name="collection-pixel-x"/>
          <label className="collection-pixel-size-label">
            Y(in pixels)
          </label>
          <input type="text" className="collection-pixel-size-input" name="collection-pixel-y"/>
          <input type="submit" value="Submit" />
        </form>
    </div>
  );
}

export default CollectionDetails;
