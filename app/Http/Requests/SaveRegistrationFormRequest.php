<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveRegistrationFormRequest extends FormRequest
{
    public function authorize() { return auth()->check(); }

    public function rules()
    {
        return [
            'exhibition_id' => ['required','exists:exhibitions,id'],
            'fields' => ['required','array'],
            'fields.*.key' => ['required','string'],
            'fields.*.label' => ['required','string'],
            'fields.*.type' => ['required','string'], // e.g. text, email, select
            'fields.*.required' => ['boolean'],
            // other constraints optional
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($v) {
            $fields = $this->input('fields', []);
            // enforce email field exists and cannot be removed
            $hasEmail = collect($fields)->contains(function ($f) {
                return ($f['type'] ?? null) === 'email' || ($f['key'] ?? '') === 'email';
            });
            if (! $hasEmail) {
                $v->errors()->add('fields', 'The registration form must include an email field.');
            }
        });
    }
}
