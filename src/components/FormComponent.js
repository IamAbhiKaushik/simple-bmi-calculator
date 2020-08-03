import React from 'react';
import '../App.css';

interface State{
    height: number;
    weight: number;
    bmi: string;
    errorMessage: string;
}


class FormComponent extends React.Component<{}, State> {
    constructor(props={}) {
        super(props);
        this.state = {
            height: 0,
            weight: 0,
            bmi: null,
            errorMessage: null,
        };
    }

    checkBmi = () => {
        const {height, weight} = this.state;
        if (height == 0){
            alert("Height value should be greater than zero.");
        }
        else{
            const bmiParameter = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ height: height, weight: weight })
            };
            fetch('http://localhost:5000/calculate_bmi', bmiParameter)
                .then(async response => {
                    const data = await response.json()
                    if (!response.ok) {
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    }
                    this.setState({ bmi: data.bmi, weight: 0, height: 0 });
                })
                .catch(error => {
                    this.setState({ errorMessage: error.toString() });
                    console.error('There was an error!', error);
                });

        }
    }

    handleWeightChange = e => {
        this.setState({
            weight: e.target.value
        });
    }

    handleHeightChange = e => {
        this.setState({
            height: e.target.value
        });
    }

    render() {
        const {height, weight, bmi, errorMessage} = this.state;
        return (
            <div className="Form-container">
                <input
                    placeholder="Enter weight"
                    onChange={this.handleWeightChange}
                    type="number"
                    value={weight}
                />
                <input
                    placeholder="Enter height"
                    onChange={this.handleHeightChange}
                    type="number"
                    value={height}
                />
                <button type="primary" onClick={this.checkBmi}>Calculate BMI</button>
                {bmi && <p className="result">Calculated BMI - {bmi}</p>}
                {errorMessage && <p className="result">Error calculating BMI - {errorMessage}</p>}
            </div>
        );
    }

}

export default FormComponent;
