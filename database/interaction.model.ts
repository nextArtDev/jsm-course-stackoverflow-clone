import { Document, Schema, model, models } from 'mongoose'

export interface IInteraction extends Document {
  user: Schema.Types.ObjectId
  action: string
  questions: Schema.Types.ObjectId
  answer: Schema.Types.ObjectId
  tags: Schema.Types.ObjectId[]
  createdOn: Date
}

const InteractionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  question: { type: Schema.Types.ObjectId, ref: 'Question' },
  answer: { type: Schema.Types.ObjectId, ref: 'Answer' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  createdOn: { type: Date, default: Date.now() },
})

const Interaction =
  models.Interaction || model('Interaction', InteractionSchema)

export default Interaction
