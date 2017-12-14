'use strict';

export default class Rotator {
    constructor(container, domElement = window) {
        this.container = container;
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
        this.lastMouseDragPos = { x: 0, y: 0 };
        this.currentMouseDragPos = { x: 0, y: 0 };
        this.dragging = false;
        this.diffX = 0;
        this.diffY = 0;
        this.ease = 0.1;
        this.axisUp = new THREE.Vector3(0, 1, 0);
        this.axisRight = new THREE.Vector3(1, 0, 0);
        this.domElement = domElement;

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);

        this.domElement.addEventListener('mousedown', this.handleMouseDown, false);
        this.domElement.addEventListener('mouseup', this.handleMouseUp, false);
        this.domElement.addEventListener('mousemove', this.handleMouseMove, false);
    }

    update() {
        this.targetRotation.x = this.currentMouseDragPos.y - this.lastMouseDragPos.y;
        this.targetRotation.y = this.currentMouseDragPos.x - this.lastMouseDragPos.x;

        this.diffY = this.targetRotation.y - this.currentRotation.y;
        this.currentRotation.y += this.diffY * this.ease;
        this.rotateAroundWorldAxis(this.container, this.axisUp, this.degreesToRads(this.currentRotation.y) * 0.25);

        this.diffX = this.targetRotation.x - this.currentRotation.x;
        this.currentRotation.x += this.diffX * this.ease;
        this.rotateAroundWorldAxis(this.container, this.axisRight, this.degreesToRads(this.currentRotation.x) * 0.25);

        this.lastMouseDragPos.x = this.currentMouseDragPos.x;
        this.lastMouseDragPos.y = this.currentMouseDragPos.y;
    }

    rotateAroundWorldAxis(object, axis, radians) {
        const rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
        rotWorldMatrix.multiply(object.matrix);
        object.matrix = rotWorldMatrix;
        object.rotation.setFromRotationMatrix(object.matrix);
    }

    degreesToRads(degrees) {
        return degrees / 180 * Math.PI;
    }

    handleMouseMove(e) {
        if (this.dragging) {
            this.currentMouseDragPos.x = e.clientX;
            this.currentMouseDragPos.y = e.clientY;
        }
    }

    handleMouseDown(e) {
        this.currentMouseDragPos.x = e.clientX;
        this.currentMouseDragPos.y = e.clientY;
        this.lastMouseDragPos.x = this.currentMouseDragPos.x;
        this.lastMouseDragPos.y = this.currentMouseDragPos.y;
        this.dragging = true;
    }

    handleMouseUp(e) {
        this.dragging = false;
    }

    dispose() {
        this.domElement.removeEventListener('mousedown', this.handleMouseDown);
        this.domElement.removeEventListener('mouseup', this.handleMouseUp);
        this.domElement.removeEventListener('mousemove', this.handleMouseMove);
        this.container = null;
        this.targetRotation = null;
        this.currentRotation = null;
        this.lastMouseDragPos = null;
        this.currentMouseDragPos = null;
        this.dragging = null;
        this.diffX = null;
        this.diffY = null;
        this.ease = null;
        this.axisUp = null;
        this.axisRight = null;
        this.domElement = null;
    }
}
