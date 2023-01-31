export default function Die(props) {
  return (
    <div
      className={props.isHeld ? "die held" : "die"}
      onClick={props.handleClick}
    >
      <h2>{props.value}</h2>
    </div>
  );
}
