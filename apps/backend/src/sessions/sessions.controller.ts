import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

interface AuthenticatedRequest {
  user: {
    id: string;
  };
}
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import {
  SessionResponseDto,
  PublicSessionResponseDto,
} from './dto/session-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Sessions')
@Controller()
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  // Protected routes for session owners
  @Post('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new session' })
  @ApiResponse({
    status: 201,
    description: 'Session created successfully',
    type: SessionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createSessionDto: CreateSessionDto,
  ): Promise<SessionResponseDto> {
    return this.sessionsService.create(req.user.id, createSessionDto);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sessions for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Sessions retrieved successfully',
    type: [SessionResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async findAll(
    @Request() req: AuthenticatedRequest,
  ): Promise<SessionResponseDto[]> {
    return this.sessionsService.findAllByUser(req.user.id);
  }

  @Get('sessions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific session by ID' })
  @ApiParam({
    name: 'id',
    description: 'Session ID',
    example: 'clxxx123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Session retrieved successfully',
    type: SessionResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only access your own sessions',
  })
  @ApiResponse({
    status: 404,
    description: 'Session not found',
  })
  async findOne(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<SessionResponseDto> {
    return this.sessionsService.findOne(id, req.user.id);
  }

  @Put('sessions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a session' })
  @ApiParam({
    name: 'id',
    description: 'Session ID',
    example: 'clxxx123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Session updated successfully',
    type: SessionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only update your own sessions',
  })
  @ApiResponse({
    status: 404,
    description: 'Session not found',
  })
  async update(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() updateSessionDto: Partial<CreateSessionDto>,
  ): Promise<SessionResponseDto> {
    return this.sessionsService.update(id, req.user.id, updateSessionDto);
  }

  @Delete('sessions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a session' })
  @ApiParam({
    name: 'id',
    description: 'Session ID',
    example: 'clxxx123456789',
  })
  @ApiResponse({
    status: 204,
    description: 'Session deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only delete your own sessions',
  })
  @ApiResponse({
    status: 404,
    description: 'Session not found',
  })
  async remove(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.sessionsService.remove(id, req.user.id);
  }

  @Put('sessions/:id/toggle-active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle session active status' })
  @ApiParam({
    name: 'id',
    description: 'Session ID',
    example: 'clxxx123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Session status toggled successfully',
    type: SessionResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only modify your own sessions',
  })
  @ApiResponse({
    status: 404,
    description: 'Session not found',
  })
  async toggleActive(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<SessionResponseDto> {
    return this.sessionsService.toggleActive(id, req.user.id);
  }

  // Public routes for visitors
  @Get('public/sessions/:id')
  @ApiOperation({ summary: 'Get public session details for booking' })
  @ApiParam({
    name: 'id',
    description: 'Session ID',
    example: 'clxxx123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Public session details retrieved successfully',
    type: PublicSessionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Session not found or inactive',
  })
  async findPublicSession(
    @Param('id') id: string,
  ): Promise<PublicSessionResponseDto> {
    return this.sessionsService.findPublicSession(id);
  }
}
