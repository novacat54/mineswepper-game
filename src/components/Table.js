function Table(props = { allCels: [], clickOnCellHandler: (''), rightClickOnCellHandler: (''), bombsNotFound: '', gameTimeTotal: '' }) {
  return (
    <table onContextMenu={(e) => e.preventDefault()}>
      <th>
        <div>{`Bombs Counter: ${props.bombsNotFound}`}</div>
        <div>Time spent: {props.gameTimeTotal} sec</div>
      </th>
      <tbody>
        {props.allCels.map((entry, index) =>
          <tr key={index}>
            {entry.map(cell =>
              <td key={cell.id}
                onClick={() => props.clickOnCellHandler(cell)}
                onContextMenu={() => props.rightClickOnCellHandler(cell)}
                className={cell.view === 'flagged' ? 'flagged' : cell.view === 'opened' ? 'opened' : ''}>
                {cell.view !== 'opened' ? '' : cell.value}</td>
            )}
          </tr>)}
      </tbody>
    </table>
  );
}

export default Table;