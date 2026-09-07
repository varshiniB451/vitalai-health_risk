import Slider from '../ui/Slider'

export default function SimulationSlider(props) {
  return (
    <div className="rounded-2xl border border-line bg-canvas/50 p-4">
      <Slider {...props} />
    </div>
  )
}
