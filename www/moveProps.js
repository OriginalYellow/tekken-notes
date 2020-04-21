export default {
  name: {
    type: String,
    required: true
  },
  startupFrames: {
    type: Number,
    required: true
  },
  onBlock: {
    type: String,
    required: true
  },
  onHit: {
    type: String,
    required: true
  },
  onCounterhit: {
    type: String,
    required: true
  },
  buttonInput: {
    type: Array,
    required: true
  },
  noteText: {
    type: String,
    default: null
  },
  id: {
    type: Number,
    required: true
  }
}
