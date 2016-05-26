import * as mongoose from 'mongoose';
/* A RAMObject defines the common attributes that all objects in the RAM
 * model will contain.
 * Most objects in RAM extend off the RAMObject
 */
export interface IRAMObject extends mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  deleteInd: boolean;
  resourceVersion: string;

  /** Instance methods */
  delete(): void;
}

export const RAMSchema = (schema: Object) => {

  const result = new mongoose.Schema({
    deleteInd: { type: Boolean, default: false },
    resourceVersion: { type: String, default: '1' }
  }, { timestamps: true });

  result.add(schema);

  result.method('delete', function () {
    this.deleteInd = true;
    this.save();
  });

  return result;
};

export interface ICodeDecode extends mongoose.Document {
  shortDecodeText: string;
  longDecodeText: string;
  startDate: Date;
  endDate: Date;
  code: string;

  /** Instance methods below */

}

export const CodeDecodeSchema = (schema: Object) => {
  const result = new mongoose.Schema({
    shortDecodeText: {
      type: String,
      required: [true, 'Short description text is required'],
      trim: true
    },
    longDecodeText: {
      type: String,
      required: [true, 'Long description text is required'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Code is required and must be string and unique'],
      trim: true,
      index: { unique: true }
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date
    }
  });
  result.add(schema);
  return result;
};
