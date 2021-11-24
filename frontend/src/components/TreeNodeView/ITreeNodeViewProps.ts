import { Node, SimulationPersonDatum } from '../../models';

export default interface ITreeNodeViewProps {
  simulationData: SimulationPersonDatum;
  personData: Node;
  handleClick: (n: Node) => void;
}
