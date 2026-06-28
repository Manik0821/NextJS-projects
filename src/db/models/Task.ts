import mongoose, {
  Schema,
  Model,
  Document,
  Types,
} from "mongoose";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed";

export type RepeatFrequency =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export interface ITask extends Document {
  _id: Types.ObjectId;

  title: string;
  description: string;

  date: Date;
  dateKey: string;

  startTime: string;
  endTime: string;

  startMinutes: number;
  endMinutes: number;

  priority: TaskPriority;
  status: TaskStatus;

  color: string;

  repeat: {
    enabled: boolean;
    frequency: RepeatFrequency;
    interval: number;
    until: string;
  };

  createdAt: Date;
  updatedAt: Date;
  excludedDates: string[];
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    date: {
      type: Date,
      required: true,
    },

    dateKey: {
      type: String,
      required: true,
      index: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    startMinutes: {
      type: Number,
      required: true,
    },

    endMinutes: {
      type: Number,
      required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "in_progress",
        "completed",
      ],
      default: "pending",
    },

    color: {
      type: String,
      default: "#3B82F6",
    },

    repeat: {
      enabled: {
        type: Boolean,
        default: false,
      },

      frequency: {
        type: String,
        enum: [
          "none",
          "daily",
          "weekly",
          "monthly",
          "yearly",
        ],
        default: "none",
      },

      interval: {
        type: Number,
        default: 1,
      },

      until: {
        type: String,
        default: "",
      },
    },
    excludedDates: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

TaskSchema.pre("validate", function () {
  this.startMinutes = timeToMinutes(this.startTime);
  this.endMinutes = timeToMinutes(this.endTime);

  if (this.endMinutes <= this.startMinutes) {
    throw new Error(
      "End time must be after start time."
    );
  }

  if (!this.repeat) {
    this.repeat = {
      enabled: false,
      frequency: "none",
      interval: 1,
      until: "",
    };
  }

  if (!this.repeat.enabled) {
    this.repeat.frequency = "none";
    this.repeat.interval = 1;
    this.repeat.until = "";
  }
});

const Task: Model<ITask> =
  mongoose.models.Task ||
  mongoose.model<ITask>("Task", TaskSchema);

export default Task;