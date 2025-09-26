export interface IForm {
    id?: string;
    userId: string;
    userFullName: string;
    date: Date;
    formData: object;
    feedback: { score: string; bonus: string; comments: string; } | null;
}